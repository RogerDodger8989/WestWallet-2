import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { AgreementsService } from './agreements.service';
import { Agreement } from '../../entities/agreement.entity';

@Controller('agreements')
export class AgreementsController {
  constructor(private readonly agreementsService: AgreementsService) {}

  @Get()
  async getAll(): Promise<Agreement[]> {
    return this.agreementsService.getAll();
  }

  @Post()
  async create(@Body() data: Partial<Agreement>): Promise<Agreement> {
    return this.agreementsService.createAgreement(data);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() data: Partial<Agreement>): Promise<Agreement> {
    return this.agreementsService.updateAgreement(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.agreementsService.deleteAgreement(id);
  }
}
