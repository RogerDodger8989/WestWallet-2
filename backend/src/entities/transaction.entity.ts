import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { WalletEntity } from './wallet.entity';

export type TxType = 'credit' | 'debit';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => WalletEntity, wallet => wallet.transactions, { nullable: false, onDelete: 'CASCADE' })
  wallet!: WalletEntity;

  @Column('float')
  amount!: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency!: string;

  @Column({ type: 'varchar', length: 10 })
  type!: TxType;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @CreateDateColumn()
  createdAt!: Date;
}