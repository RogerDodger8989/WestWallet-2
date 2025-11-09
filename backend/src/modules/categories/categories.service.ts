import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../../entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepo: Repository<CategoryEntity>,
  ) {}

  async findAll(): Promise<CategoryEntity[]> {
    return this.categoryRepo.find({ relations: ['suppliers'], order: { name: 'ASC' } });
  }

  async findOne(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepo.findOne({ where: { id }, relations: ['suppliers'] });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(name: string): Promise<CategoryEntity> {
    const existing = await this.categoryRepo.findOne({ where: { name } });
    if (existing) throw new ConflictException('Category already exists');
    
    const category = this.categoryRepo.create({ name });
    return this.categoryRepo.save(category);
  }

  async update(id: number, name: string): Promise<CategoryEntity> {
    const category = await this.findOne(id);
    category.name = name;
    return this.categoryRepo.save(category);
  }

  async delete(id: number): Promise<void> {
    const result = await this.categoryRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Category not found');
  }
}
