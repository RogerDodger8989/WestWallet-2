import { Controller, Get, Post, Body, Param, Put, Delete, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AgreementsService } from './agreements.service';
import { Agreement } from '../../entities/agreement.entity';

@UseGuards(AuthGuard('jwt'))
@Controller('agreements')
export class AgreementsController {
  constructor(private readonly agreementsService: AgreementsService) {}

  @Get()
  async getAll(): Promise<Agreement[]> {
    return this.agreementsService.getAll();
  }

  @Post()
  async create(@Request() req: any, @Body() data: Partial<Agreement>): Promise<Agreement> {
    // Associate agreement with the authenticated user
    (data as any).userId = req.user?.sub;
    return this.agreementsService.createAgreement(data);
  }

  @Put(':id')
  async update(@Request() req: any, @Param('id') id: string, @Body() data: Partial<Agreement>): Promise<Agreement> {
    // Ensure ownership remains with the authenticated user
    (data as any).userId = req.user?.sub;
    return this.agreementsService.updateAgreement(id, data);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.agreementsService.deleteAgreement(id);
  }
}
