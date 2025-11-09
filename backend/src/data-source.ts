import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { join } from 'path';

// Entities
import { UserEntity } from './entities/user.entity';
import { CategoryEntity } from './entities/category.entity';
import { SupplierEntity } from './entities/supplier.entity';
import { WalletEntity } from './entities/wallet.entity';
import { TransactionEntity } from './entities/transaction.entity';
import { ExpenseEntity } from './entities/expense.entity';
import { ImportRuleEntity } from './entities/import-rule.entity';

// Central TypeORM DataSource for CLI/migrations
export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: process.env.SQLITE_DB || join(__dirname, '..', 'data', 'sqlite.db'),
  entities: [UserEntity, CategoryEntity, SupplierEntity, WalletEntity, TransactionEntity, ExpenseEntity, ImportRuleEntity],
  // disable synchronize here – use migrations instead (can override via env for dev convenience)
  synchronize: process.env.TYPEORM_SYNC === 'true',
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  logging: false,
});

export default AppDataSource;
