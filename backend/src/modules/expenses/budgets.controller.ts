import { Controller, Get, Post, Put, Delete, Body, Param, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BudgetsService } from './budgets.service';

@UseGuards(AuthGuard('jwt'))
@Controller('budgets')
export class BudgetsController {
  constructor(private budgetsService: BudgetsService) {}

  @Get('category')
  async listCategoryBudgets(@Request() req: any) {
    return this.budgetsService.list(req.user.sub);
  }

  @Post('category')
  async createCategoryBudget(@Request() req: any, @Body() body: { categoryId: number; monthlyLimit: number; startMonth?: string; endMonth?: string }) {
    return this.budgetsService.create(req.user.sub, body);
  }

  @Put('category/:id')
  async updateCategoryBudget(@Request() req: any, @Param('id') id: string, @Body() body: Partial<{ monthlyLimit: number; startMonth?: string; endMonth?: string }>) {
    return this.budgetsService.update(req.user.sub, Number(id), body);
  }

  @Delete('category/:id')
  async deleteCategoryBudget(@Request() req: any, @Param('id') id: string) {
    await this.budgetsService.delete(req.user.sub, Number(id));
    return { message: 'Budget deleted' };
  }
}
