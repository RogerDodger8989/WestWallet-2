import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SuppliersService, CreateSupplierDto } from './suppliers.service';

@UseGuards(AuthGuard('jwt'))
@Controller('suppliers')
export class SuppliersController {
  constructor(private suppliersService: SuppliersService) {}

  @Get()
  async list(@Query('categoryId') categoryId?: string) {
    return this.suppliersService.findAll(categoryId ? Number(categoryId) : undefined);
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.suppliersService.findOne(Number(id));
  }

  @Post()
  async create(@Body() dto: CreateSupplierDto) {
    return this.suppliersService.create(dto);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreateSupplierDto>) {
    return this.suppliersService.update(Number(id), dto);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.suppliersService.delete(Number(id));
    return { message: 'Supplier deleted' };
  }
}
