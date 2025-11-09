import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CategoryEntity } from './category.entity';
import { UserEntity } from './user.entity';

@Entity('category_budgets')
export class CategoryBudgetEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => CategoryEntity, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'categoryId' })
  category!: CategoryEntity;

  @Column()
  categoryId!: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user!: UserEntity;

  @Column()
  userId!: number;

  // Budget tak per månad (SEK)
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  monthlyLimit!: number;

  // Optional start month for when budget applies (YYYY-MM)
  @Column({ nullable: true })
  startMonth?: string;

  // Optional end month (inclusive)
  @Column({ nullable: true })
  endMonth?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
