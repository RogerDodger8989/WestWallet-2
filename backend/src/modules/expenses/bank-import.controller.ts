import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { BankImportService } from './bank-import.service';

@UseGuards(AuthGuard('jwt'))
@Controller('expenses/import')
export class BankImportController {
  constructor(private bankImportService: BankImportService) {}

  @Post('parse')
  @UseInterceptors(FileInterceptor('file'))
  async parseFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const result = await this.bankImportService.parseFile(
      file.buffer,
      file.originalname,
      req.user.sub,
    );

    return result;
  }

  // Import rules CRUD
  @Get('rules')
  async getRules(@Request() req: any) {
    return this.bankImportService.getRules(req.user.sub);
  }

  @Post('rules')
  async createRule(
    @Request() req: any,
    @Body() body: { pattern: string; categoryId?: number; supplierId?: number },
  ) {
    return this.bankImportService.createRule(
      req.user.sub,
      body.pattern,
      body.categoryId,
      body.supplierId,
    );
  }

  @Put('rules/:id')
  async updateRule(
    @Request() req: any,
    @Param('id') id: string,
    @Body() body: Partial<{ pattern: string; categoryId?: number; supplierId?: number; active: boolean }>,
  ) {
    return this.bankImportService.updateRule(Number(id), req.user.sub, body);
  }

  @Delete('rules/:id')
  async deleteRule(@Request() req: any, @Param('id') id: string) {
    await this.bankImportService.deleteRule(Number(id), req.user.sub);
    return { message: 'Rule deleted' };
  }
}
