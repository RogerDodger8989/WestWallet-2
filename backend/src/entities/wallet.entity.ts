import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { TransactionEntity } from './transaction.entity';

@Entity('wallets')
export class WalletEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 10, default: 'USD' })
  currency!: string;

  @ManyToOne(() => UserEntity, user => (user as any).wallets, { nullable: false, onDelete: 'CASCADE' })
  owner!: UserEntity;

  @OneToMany(() => TransactionEntity, tx => tx.wallet)
  transactions!: TransactionEntity[];

  @CreateDateColumn()
  createdAt!: Date;
}