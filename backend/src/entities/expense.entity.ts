import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { SupplierEntity } from './supplier.entity';
import { UserEntity } from './user.entity';

@Entity('expenses')
export class ExpenseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  // Unique display ID (A000001, A000002, etc.)
  @Column({ unique: true })
  displayId!: string;

  @Column()
  name!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column() // 'income' or 'expense'
  type!: string;

  // Currency code (ISO 4217). Default SEK.
  @Column({ default: 'SEK' })
  currency!: string;

  @Column() // YYYY-MM format
  month!: string;

  @ManyToOne(() => CategoryEntity, { onDelete: 'SET NULL', nullable: true, eager: true })
  @JoinColumn({ name: 'categoryId' })
  category?: CategoryEntity;

  @Column({ nullable: true })
  categoryId?: number;

  @ManyToOne(() => SupplierEntity, { onDelete: 'SET NULL', nullable: true, eager: true })
  @JoinColumn({ name: 'supplierId' })
  supplier?: SupplierEntity;

  @Column({ nullable: true })
  supplierId?: number;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  // Images stored as JSON array of filenames
  @Column({ type: 'simple-json', nullable: true })
  images?: string[];

  // Optional tags for classification (e.g. ['jobb','privat'])
  @Column({ type: 'simple-json', nullable: true })
  tags?: string[];

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @Column()
  userId!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
