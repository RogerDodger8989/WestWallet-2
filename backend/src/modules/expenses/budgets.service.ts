import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryBudgetEntity } from '../../entities/category-budget.entity';

@Injectable()
export class BudgetsService {
  constructor(
    @InjectRepository(CategoryBudgetEntity)
    private budgetRepo: Repository<CategoryBudgetEntity>,
  ) {}

  async list(userId: number) {
    return this.budgetRepo.find({ where: { userId } });
  }

  async create(userId: number, body: { categoryId: number; monthlyLimit: number; startMonth?: string; endMonth?: string }) {
    const entity = this.budgetRepo.create({ ...body, userId });
    return this.budgetRepo.save(entity);
  }

  async update(userId: number, id: number, updates: Partial<{ monthlyLimit: number; startMonth?: string; endMonth?: string }>) {
    const entity = await this.budgetRepo.findOne({ where: { id, userId } });
    if (!entity) throw new NotFoundException('Budget not found');
    Object.assign(entity, updates);
    return this.budgetRepo.save(entity);
  }

  async delete(userId: number, id: number) {
    const entity = await this.budgetRepo.findOne({ where: { id, userId } });
    if (!entity) throw new NotFoundException('Budget not found');
    await this.budgetRepo.remove(entity);
  }
}
