import { Controller, Get, Post, Put, Delete, Body, Param, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ExpensesService, CreateExpenseDto } from './expenses.service';

@UseGuards(AuthGuard('jwt'))
@Controller('expenses')
export class ExpensesController {
  constructor(private expensesService: ExpensesService) {}

  @Get()
  async list(
    @Request() req: any,
    @Query('year') year?: string,
    @Query('months') months?: string, // comma-separated YYYY-MM
    @Query('type') type?: 'income' | 'expense',
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
  ) {
    const parsedMonths = months ? months.split(',').map(m => m.trim()).filter(Boolean) : undefined;
    const parsedYear = year ? parseInt(year, 10) : undefined;
    const parsedCategoryId = categoryId ? parseInt(categoryId, 10) : undefined;
    return this.expensesService.findAll(req.user.sub, {
      year: parsedYear,
      months: parsedMonths,
      type,
      categoryId: parsedCategoryId,
      search,
    });
  }

  @Get(':id')
  async get(@Request() req: any, @Param('id') id: string) {
    return this.expensesService.findOne(Number(id), req.user.sub);
  }

  @Post()
  async create(@Request() req: any, @Body() dto: CreateExpenseDto & { tags?: string[] }) {
    return this.expensesService.create(req.user.sub, dto);
  }

  @Put(':id')
  async update(@Request() req: any, @Param('id') id: string, @Body() dto: Partial<CreateExpenseDto & { tags?: string[] }>) {
    return this.expensesService.update(Number(id), dto, req.user.sub);
  }

  @Delete(':id')
  async delete(@Request() req: any, @Param('id') id: string) {
    await this.expensesService.delete(Number(id), req.user.sub);
    return { message: 'Expense deleted' };
  }

  @Post(':id/images')
  async addImage(@Request() req: any, @Param('id') id: string, @Body() body: { filename: string }) {
    return this.expensesService.addImage(Number(id), req.user.sub, body.filename);
  }

  @Delete(':id/images/:filename')
  async removeImage(@Request() req: any, @Param('id') id: string, @Param('filename') filename: string) {
    return this.expensesService.removeImage(Number(id), req.user.sub, filename);
  }

  @Delete(':id/images')
  async removeAllImages(@Request() req: any, @Param('id') id: string) {
    return this.expensesService.removeAllImages(Number(id), req.user.sub);
    return { message: 'All images removed' };
  }
}
