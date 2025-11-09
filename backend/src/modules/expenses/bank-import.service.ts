import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ImportRuleEntity } from '../../entities/import-rule.entity';
import { ExpenseEntity } from '../../entities/expense.entity';
import * as XLSX from 'xlsx';

export interface ParsedTransaction {
  date: string; // YYYY-MM-DD
  description: string;
  amount: number;
  reference?: string;
  suggestedCategoryId?: number;
  suggestedSupplierId?: number;
  isDuplicate: boolean;
  originalRow: any;
}

export interface ImportResult {
  transactions: ParsedTransaction[];
  summary: {
    total: number;
    duplicates: number;
    matched: number;
  };
}

@Injectable()
export class BankImportService {
  constructor(
    @InjectRepository(ImportRuleEntity)
    private importRuleRepo: Repository<ImportRuleEntity>,
    @InjectRepository(ExpenseEntity)
    private expenseRepo: Repository<ExpenseEntity>,
  ) {}

  async parseFile(buffer: Buffer, filename: string, userId: number): Promise<ImportResult> {
    try {
      const ext = filename.toLowerCase().split('.').pop();
      
      let rows: any[] = [];
      
      if (ext === 'xlsx' || ext === 'xls') {
        rows = this.parseXLSX(buffer);
      } else if (ext === 'csv') {
        rows = await this.parseCSV(buffer);
      } else {
        throw new Error('Unsupported file format. Use .xlsx or .csv');
      }

      console.log(`Parsed ${rows.length} rows from ${filename}`);

      // Hämta användarens regler och befintliga expenses
      const rules = await this.importRuleRepo.find({ where: { userId, active: true } });
      const expenses = await this.expenseRepo.find({ where: { userId } });

      const transactions: ParsedTransaction[] = [];
      let duplicates = 0;
      let matched = 0;

      for (const row of rows) {
        const parsed = this.parseTransaction(row);
        if (!parsed) continue;

        // Kolla om dubblett
        const isDuplicate = this.checkDuplicate(parsed, expenses);
        if (isDuplicate) duplicates++;

        // Försök matcha med regler
        const matchedRule = this.matchRule(parsed.description, rules);
        if (matchedRule) {
          matched++;
          parsed.suggestedCategoryId = matchedRule.categoryId;
          parsed.suggestedSupplierId = matchedRule.supplierId;
        }

        parsed.isDuplicate = isDuplicate;
        transactions.push(parsed);
      }

      return {
        transactions,
        summary: {
          total: transactions.length,
          duplicates,
          matched,
        },
      };
    } catch (error) {
      console.error('Parse file error:', error);
      throw error;
    }
  }

  private parseXLSX(buffer: Buffer): any[] {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Sparbanken Skåne har headers på rad 9 (index 8), data från rad 10
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });
    
    // Hitta header-rad (den som innehåller "Beskrivning")
    let headerIndex = -1;
    for (let i = 0; i < Math.min(15, rawData.length); i++) {
      const row = rawData[i] as any[];
      if (row.some(cell => String(cell).includes('Beskrivning'))) {
        headerIndex = i;
        break;
      }
    }

    if (headerIndex === -1) {
      throw new Error('Could not find header row with "Beskrivning"');
    }

    const headers = rawData[headerIndex] as string[];
    const dataRows = rawData.slice(headerIndex + 1);

    return dataRows.map((row: any) => {
      const obj: any = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      return obj;
    }).filter(row => row['Beskrivning']); // Filtrera bort tomma rader
  }

  private async parseCSV(buffer: Buffer): Promise<any[]> {
    const csvParse = require('csv-parse/sync');
    const text = buffer.toString('utf-8');
    
    // Sparbanken CSV har header på rad 2, första raden är titel
    const lines = text.split('\n');
    const dataLines = lines.slice(1); // Hoppa över första raden (titel)
    const csvText = dataLines.join('\n');

    const records = csvParse.parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    return records;
  }

  private parseTransaction(row: any): ParsedTransaction | null {
    try {
      // Extrahera data från rad (stödjer både XLSX och CSV kolumnnamn)
      const dateField = row['Bokföringsdag'] || row['Bokforingsdag'] || row['Transaktionsdag'];
      const descField = row['Beskrivning'];
      const amountField = row['Belopp'] || row['Belopp '];
      const refField = row['Referens'];

      if (!dateField || !descField || amountField === undefined || amountField === '') {
        console.log('Skipping row - missing required fields:', { dateField, descField, amountField });
        return null;
      }

      // Parse datum (kan vara Excel serial number eller string)
      let date: string;
      if (typeof dateField === 'number') {
        // Excel date serial number
        const excelDate = XLSX.SSF.parse_date_code(dateField);
        date = `${excelDate.y}-${String(excelDate.m).padStart(2, '0')}-${String(excelDate.d).padStart(2, '0')}`;
      } else {
        date = String(dateField).substring(0, 10); // YYYY-MM-DD
      }

      // Parse belopp (kan ha komma som decimaltecken)
      let amount: number;
      if (typeof amountField === 'number') {
        amount = amountField;
      } else {
        const amountStr = String(amountField).replace(/\s/g, '').replace(',', '.');
        amount = parseFloat(amountStr);
      }

      if (isNaN(amount)) {
        console.log('Skipping row - invalid amount:', amountField);
        return null;
      }

      return {
        date,
        description: String(descField).trim(),
        amount,
        reference: refField ? String(refField) : undefined,
        isDuplicate: false,
        originalRow: row,
      };
    } catch (error) {
      console.error('Error parsing transaction:', error, row);
      return null;
    }
  }

  private checkDuplicate(transaction: ParsedTransaction, expenses: ExpenseEntity[]): boolean {
    // Dubblett = samma datum + belopp (inom 0.01 kr)
    return expenses.some(exp => {
      const expMonth = exp.month; // YYYY-MM
      const transMonth = transaction.date.substring(0, 7);
      return expMonth === transMonth && Math.abs(exp.amount - transaction.amount) < 0.01;
    });
  }

  private matchRule(description: string, rules: ImportRuleEntity[]): ImportRuleEntity | undefined {
    const lowerDesc = description.toLowerCase();
    return rules.find(rule => lowerDesc.includes(rule.pattern.toLowerCase()));
  }

  // CRUD för importregler
  async createRule(userId: number, pattern: string, categoryId?: number, supplierId?: number) {
    const rule = this.importRuleRepo.create({
      userId,
      pattern,
      categoryId,
      supplierId,
    });
    return this.importRuleRepo.save(rule);
  }

  async getRules(userId: number) {
    return this.importRuleRepo.find({ where: { userId } });
  }

  async updateRule(id: number, userId: number, updates: Partial<ImportRuleEntity>) {
    const rule = await this.importRuleRepo.findOne({ where: { id, userId } });
    if (!rule) throw new Error('Rule not found');
    Object.assign(rule, updates);
    return this.importRuleRepo.save(rule);
  }

  async deleteRule(id: number, userId: number) {
    const rule = await this.importRuleRepo.findOne({ where: { id, userId } });
    if (!rule) throw new Error('Rule not found');
    await this.importRuleRepo.remove(rule);
  }
}
