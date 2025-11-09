import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agreement } from '../../entities/agreement.entity';
import { ExpenseEntity } from '../../entities/expense.entity';

@Injectable()
export class AgreementsService {
  constructor(
    @InjectRepository(Agreement)
    private readonly agreementRepo: Repository<Agreement>,
    @InjectRepository(ExpenseEntity)
    private readonly expenseRepo: Repository<ExpenseEntity>,
  ) {}

  async createAgreement(data: Partial<Agreement>): Promise<Agreement> {
    const agreement = this.agreementRepo.create(data);
    await this.agreementRepo.save(agreement);
    await this.generateExpensesForAgreement(agreement);
    return agreement;
  }

  async generateExpensesForAgreement(agreement: Agreement) {
    // Skapa Expense-poster utifrån frekvens och datumintervall
    const start = agreement.startMonth;
    const end = agreement.endMonth || start;
    const freq = agreement.frequency;
    const cost = agreement.costPerMonth;
    const expenses: ExpenseEntity[] = [];
    let current = start;
    while (current <= end) {
      const expense = this.expenseRepo.create({
        name: agreement.name,
        amount: cost,
        type: 'expense',
        month: current,
        notes: agreement.notes,
        agreementId: agreement.id,
        categoryId: agreement.categoryId,
        supplierId: agreement.supplierId,
        userId: (agreement as any).userId,
      });
      expenses.push(expense);
      // Logga expense för felsökning
      console.log('[Expense from Agreement]', {
        name: expense.name,
        amount: expense.amount,
        type: expense.type,
        month: expense.month,
        agreementId: expense.agreementId,
        categoryId: expense.categoryId,
        supplierId: expense.supplierId,
        userId: expense.userId,
      });
      // Nästa månad/kvartal/halvår/år
      const [year, month] = current.split('-').map(Number);
      let nextMonth = month;
      if (freq === 'Månadsvis') nextMonth += 1;
      else if (freq === 'Kvartalsvis') nextMonth += 3;
      else if (freq === 'Halvårsvis') nextMonth += 6;
      else if (freq === 'Årligen') nextMonth += 12;
      let nextYear = year;
      while (nextMonth > 12) { nextMonth -= 12; nextYear += 1; }
      current = `${nextYear}-${String(nextMonth).padStart(2, '0')}`;
    }
    await this.expenseRepo.save(expenses);
  }

  async updateAgreement(id: string, data: Partial<Agreement>): Promise<Agreement> {
    await this.agreementRepo.update(id, data);
  const agreement = await this.agreementRepo.findOne({ where: { id } });
  // TODO: Synka expenses vid ändring
  return agreement!;
  }

  async deleteAgreement(id: string): Promise<void> {
    await this.agreementRepo.delete(id);
    await this.expenseRepo.delete({ agreementId: id });
  }

  async getAll(): Promise<Agreement[]> {
    return this.agreementRepo.find({ relations: ['expenses'] });
  }
}
