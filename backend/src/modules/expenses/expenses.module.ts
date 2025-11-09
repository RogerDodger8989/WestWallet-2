import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import { ExpenseEntity } from '../../entities/expense.entity';
import { ImportRuleEntity } from '../../entities/import-rule.entity';
import { CategoryEntity } from '../../entities/category.entity';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { UploadController } from './upload.controller';
import { BankImportController } from './bank-import.controller';
import { BankImportService } from './bank-import.service';
import { CategoryBudgetEntity } from '../../entities/category-budget.entity';
import { BudgetsController } from './budgets.controller';
import { BudgetsService } from './budgets.service';

@Module({
  imports: [
  TypeOrmModule.forFeature([ExpenseEntity, ImportRuleEntity, CategoryEntity, CategoryBudgetEntity]),
    MulterModule.register({
      storage: require('multer').memoryStorage(), // Lagra i minnet för import
    }),
  ],
  controllers: [ExpensesController, UploadController, BankImportController, BudgetsController],
  providers: [ExpensesService, BankImportService, BudgetsService],
  exports: [ExpensesService, BankImportService, BudgetsService],
})
export class ExpensesModule {}
