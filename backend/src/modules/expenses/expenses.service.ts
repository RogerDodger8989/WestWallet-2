import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExpenseEntity } from '../../entities/expense.entity';

export interface CreateExpenseDto {
  name: string;
  amount: number;
  type: 'income' | 'expense';
  month: string; // YYYY-MM
  categoryId?: number;
  supplierId?: number;
  notes?: string;
  images?: string[];
  currency?: string;
  tags?: string[];
}

export interface ExpenseFilterOptions {
  year?: number;
  months?: string[];
  type?: 'income' | 'expense';
  categoryId?: number;
  supplierId?: number;
  search?: string;
}

@Injectable()
export class ExpensesService {
  constructor(
    @InjectRepository(ExpenseEntity)
    private expenseRepo: Repository<ExpenseEntity>,
  ) {}

  async generateDisplayId(): Promise<string> {
    // Get the latest expense to determine next ID
    const latest = await this.expenseRepo.find({
      order: { id: 'DESC' },
      take: 1,
    });

    let nextNumber = 1;
    if (latest.length > 0 && latest[0].displayId) {
      // Extract number from A000001 format
      const match = latest[0].displayId.match(/A(\d+)/);
      if (match) {
        nextNumber = parseInt(match[1], 10) + 1;
      }
    }

    return `A${String(nextNumber).padStart(6, '0')}`;
  }

  async findAll(userId: number, filters: ExpenseFilterOptions = {}): Promise<ExpenseEntity[]> {
    const { year, months, type, categoryId, supplierId, search } = filters;

    let query = this.expenseRepo.createQueryBuilder('expense')
      .leftJoinAndSelect('expense.category', 'category')
      .leftJoinAndSelect('expense.supplier', 'supplier')
      .where('expense.userId = :userId', { userId });

    if (year && !months) {
      // Filter by year only if months not provided
      query = query.andWhere('substr(expense.month,1,4) = :year', { year: String(year) });
    }

    if (months && months.length > 0) {
      query = query.andWhere('expense.month IN (:...months)', { months });
    }

    if (type) {
      query = query.andWhere('expense.type = :type', { type });
    }

    if (categoryId) {
      query = query.andWhere('expense.categoryId = :categoryId', { categoryId });
    }

    if (supplierId) {
      query = query.andWhere('expense.supplierId = :supplierId', { supplierId });
    }

    if (search) {
      query = query.andWhere('(' + [
        'expense.name LIKE :search',
        'expense.notes LIKE :search',
        'expense.displayId LIKE :search'
      ].join(' OR ') + ')', { search: `%${search}%` });
    }

    return query.orderBy('expense.month', 'DESC')
      .addOrderBy('expense.createdAt', 'DESC')
      .getMany();
  }

  async findOne(id: number, userId: number): Promise<ExpenseEntity> {
    const expense = await this.expenseRepo.findOne({
      where: { id, userId },
      relations: ['category', 'supplier'],
    });
    if (!expense) throw new NotFoundException('Expense not found');
    return expense;
  }

  async create(userId: number, dto: CreateExpenseDto): Promise<ExpenseEntity> {
    const displayId = await this.generateDisplayId();
    const expense = this.expenseRepo.create({
      ...dto,
      displayId,
      userId,
    });
    return this.expenseRepo.save(expense);
  }

  async update(id: number, dto: Partial<CreateExpenseDto>, userId: number): Promise<ExpenseEntity> {
    const expense = await this.findOne(id, userId);
    Object.assign(expense, dto);
    return this.expenseRepo.save(expense);
  }

  async delete(id: number, userId: number): Promise<void> {
    const expense = await this.findOne(id, userId);
    await this.expenseRepo.remove(expense);
  }

  async addImage(id: number, userId: number, filename: string): Promise<ExpenseEntity> {
    const expense = await this.findOne(id, userId);
    if (!expense.images) {
      expense.images = [];
    }
    expense.images.push(filename);
    return this.expenseRepo.save(expense);
  }

  async removeImage(id: number, userId: number, filename: string): Promise<ExpenseEntity> {
    const expense = await this.findOne(id, userId);
    if (expense.images) {
      expense.images = expense.images.filter(img => img !== filename);
    }
    return this.expenseRepo.save(expense);
  }

  async removeAllImages(id: number, userId: number): Promise<ExpenseEntity> {
    const expense = await this.findOne(id, userId);
    expense.images = [];
    return this.expenseRepo.save(expense);
  }
}
