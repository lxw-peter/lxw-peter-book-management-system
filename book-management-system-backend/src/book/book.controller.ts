import {
  Controller,
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import * as path from 'path';
import { FileInterceptor } from '@nestjs/platform-express';
import { storage } from './my-file-storage';
import { BadRequestException } from '@nestjs/common/exceptions';

@Controller('book')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      dest: 'uploads',
      storage: storage,
      limits: {
        fileSize: 1024 * 1024 * 5, // 5MB
      },
      fileFilter: (req, file, callback) => {
        const extname = path.extname(file.originalname).toLowerCase();
        if (['.jpg', '.jpeg', '.png'].includes(extname)) {
          return callback(null, true);
        } else {
          return callback(
            new BadRequestException('Only image files are allowed'),
            false,
          );
        }
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('file', file);
    return file.path;
  }

  @Get()
  async list() {
    return this.bookService.list();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.bookService.findById(+id);
  }

  @Post('create')
  async create(@Body() createBookDto: CreateBookDto) {
    return this.bookService.create(createBookDto);
  }

  @Put('update')
  async update(@Body() updateBookDto: UpdateBookDto) {
    return this.bookService.update(updateBookDto);
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return this.bookService.delete(+id);
  }
}
