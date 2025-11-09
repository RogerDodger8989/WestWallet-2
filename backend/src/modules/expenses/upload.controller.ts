import { Controller, Post, Delete, Param, UseInterceptors, UploadedFile, BadRequestException, NotFoundException, UseGuards, Req } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { ExpensesService } from './expenses.service';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Controller('expenses')
@UseGuards(AuthGuard('jwt'))
export class UploadController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Post(':id/upload')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueName = `${uuidv4()}${extname(file.originalname)}`;
        callback(null, uniqueName);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|gif|pdf)$/)) {
        return callback(new BadRequestException('Only image files and PDFs are allowed!'), false);
      }
      callback(null, true);
    },
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB max
    },
  }))
  async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: any,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const expense = await this.expensesService.findOne(+id, req.user.userId);
    if (!expense) {
      // Delete uploaded file if expense not found
      await unlink(file.path);
      throw new NotFoundException('Expense not found');
    }

    // Add filename to expense images array
    const images = expense.images || [];
    images.push(file.filename);

    await this.expensesService.update(+id, { images }, req.user.userId);

    // Hämta uppdaterad expense med alla relationer
    const updatedExpense = await this.expensesService.findOne(+id, req.user.userId);

    return {
      message: 'File uploaded successfully',
      filename: file.filename,
      path: `/uploads/${file.filename}`,
      images: updatedExpense.images,
    };
  }

  @Delete(':id/images/:filename')
  async deleteImage(
    @Param('id') id: string,
    @Param('filename') filename: string,
    @Req() req: any,
  ) {
    const expense = await this.expensesService.findOne(+id, req.user.userId);
    if (!expense) {
      throw new NotFoundException('Expense not found');
    }

    // Remove filename from images array
    const images = (expense.images || []).filter(img => img !== filename);
    await this.expensesService.update(+id, { images }, req.user.userId);

    // Delete physical file
    try {
      await unlink(join('./uploads', filename));
    } catch (error) {
      console.error('Failed to delete file:', error);
    }

    return { 
      message: 'Image deleted successfully',
      images: images,
    };
  }
}
