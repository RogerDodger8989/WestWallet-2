import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AgreementsService } from './agreements.service';
import { AgreementsController } from './agreements.controller';
import { Agreement } from '../../entities/agreement.entity';
import { ExpenseEntity } from '../../entities/expense.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Agreement, ExpenseEntity])],
  providers: [AgreementsService],
  controllers: [AgreementsController],
})
export class AgreementsModule {}
