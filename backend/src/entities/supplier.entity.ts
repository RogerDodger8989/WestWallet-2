import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { CategoryEntity } from './category.entity';

@Entity('suppliers')
export class SupplierEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => CategoryEntity, category => category.suppliers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'categoryId' })
  category!: CategoryEntity;

  @Column()
  categoryId!: number;

  // Contact details
  @Column({ nullable: true })
  organizationNumber?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  postalCode?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  email?: string; // Comma separated if multiple

  @Column({ nullable: true })
  phone?: string;

  @Column({ nullable: true })
  bankAccount?: string; // Bankgiro/Plusgiro/IBAN

  @Column({ nullable: true })
  contactPerson?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
