import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RootController } from './root.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { join } from 'path';
import { WalletsModule } from './modules/wallets/wallets.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { SuppliersModule } from './modules/suppliers/suppliers.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { AgreementsModule } from './modules/agreements/agreements.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      // Resolve DB path relative to the backend folder to avoid surprises when starting from different CWDs
      database: process.env.SQLITE_DB || join(__dirname, '..', 'data', 'sqlite.db'),
      entities: [UserEntity, __dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.TYPEORM_SYNC === 'true' || true, // keep true by default for dev; can disable via env
      logging: false
    }),
    UsersModule,
    AuthModule,
    WalletsModule,
    CategoriesModule,
    SuppliersModule,
  ExpensesModule,
  AgreementsModule,
  ],
  controllers: [RootController],
})
export class AppModule {}
