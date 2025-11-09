import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CategoriesService } from './categories.service';

class CreateCategoryDto {
  name!: string;
}

@UseGuards(AuthGuard('jwt'))
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  async list() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.categoriesService.findOne(Number(id));
  }

  @Post()
  async create(@Body() dto: CreateCategoryDto) {
    return this.categoriesService.create(dto.name);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() dto: CreateCategoryDto) {
    return this.categoriesService.update(Number(id), dto.name);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.categoriesService.delete(Number(id));
    return { message: 'Category deleted' };
  }
}
