import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SupplierEntity } from '../../entities/supplier.entity';

export interface CreateSupplierDto {
  name: string;
  categoryId: number;
  organizationNumber?: string;
  address?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  email?: string;
  phone?: string;
  bankAccount?: string;
  contactPerson?: string;
  notes?: string;
}

@Injectable()
export class SuppliersService {
  constructor(
    @InjectRepository(SupplierEntity)
    private supplierRepo: Repository<SupplierEntity>,
  ) {}

  async findAll(categoryId?: number): Promise<SupplierEntity[]> {
    const where = categoryId ? { categoryId } : {};
    return this.supplierRepo.find({ 
      where, 
      relations: ['category'], 
      order: { name: 'ASC' } 
    });
  }

  async findOne(id: number): Promise<SupplierEntity> {
    const supplier = await this.supplierRepo.findOne({ 
      where: { id }, 
      relations: ['category'] 
    });
    if (!supplier) throw new NotFoundException('Supplier not found');
    return supplier;
  }

  async create(dto: CreateSupplierDto): Promise<SupplierEntity> {
    const supplier = this.supplierRepo.create(dto);
    return this.supplierRepo.save(supplier);
  }

  async update(id: number, dto: Partial<CreateSupplierDto>): Promise<SupplierEntity> {
    const supplier = await this.findOne(id);
    Object.assign(supplier, dto);
    return this.supplierRepo.save(supplier);
  }

  async delete(id: number): Promise<void> {
    const result = await this.supplierRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Supplier not found');
  }
}
