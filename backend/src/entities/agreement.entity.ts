import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { UserEntity } from './user.entity';
import { ExpenseEntity } from './expense.entity';

@Entity('agreements')
export class Agreement {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  category!: string;

  @Column()
  supplier!: string;

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
  user?: UserEntity;

  @OneToMany(() => ExpenseEntity, expense => expense.agreement)
  expenses!: ExpenseEntity[];
}
