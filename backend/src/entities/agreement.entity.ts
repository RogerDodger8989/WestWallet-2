import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { SupplierEntity } from './supplier.entity';
import { UserEntity } from './user.entity';
import { ExpenseEntity } from './expense.entity';

@Entity('agreements')
export class Agreement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;


  @ManyToOne(() => CategoryEntity, { nullable: false, eager: true })
  @JoinColumn({ name: 'categoryId' })
  category!: CategoryEntity;

  @Column()
  categoryId!: number;

  @ManyToOne(() => SupplierEntity, { nullable: false, eager: true })
  @JoinColumn({ name: 'supplierId' })
  supplier!: SupplierEntity;

  @Column()
  supplierId!: number;

  @Column({ nullable: true })
  owner!: string;

  @Column()
  startMonth!: string; // YYYY-MM

  @Column({ nullable: true })
  endMonth!: string; // YYYY-MM

  @Column({ nullable: true, type: 'int' })
  monthsCount?: number;

  @Column('float')
  costPerMonth!: number;

  @Column({ default: 'Månadsvis' })
  frequency!: 'Månadsvis' | 'Kvartalsvis' | 'Halvårsvis' | 'Årligen';

  @Column({ nullable: true })
  notes?: string;

  @Column({ default: 'aktiv' })
  status!: 'aktiv' | 'avslutad' | 'undertecknad' | 'väntar på motpart';

  @ManyToOne(() => UserEntity, { nullable: true })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @Column({ nullable: true })
  userId?: number;

  @OneToMany(() => ExpenseEntity, expense => expense.agreement)
  expenses!: ExpenseEntity[];
}
