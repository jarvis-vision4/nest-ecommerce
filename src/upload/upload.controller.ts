import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import * as path from "node:path"
import { TransformDto } from 'src/cores/interceptors/transform-dto.interceptor';
import { ResponseUploadDto } from './dto/response-upload.dto';

@Controller('api/v1/upload')
@TransformDto(ResponseUploadDto)
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  // @Post()
  // create(@Body() createUploadDto: CreateUploadDto) {
  //   return this.uploadService.create(createUploadDto);
  // }

  @Post()
  @UseInterceptors(FileInterceptor('productImage', {
    storage: diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.join(process.cwd(), "uploads", "products"))
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, `${uniqueSuffix}-${file.originalname}`);
      }
    })
  }))
  uploadFile(@UploadedFile(
    new ParseFilePipe({
      validators: [
        new MaxFileSizeValidator({ maxSize: 1000000 }),

      ],
    }),)
  file: Express.Multer.File,) {
    console.log(file.mimetype);
    return {
      "message": "Upload Success"
    }
  }

  @Get()
  findAll() {
    return this.uploadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.uploadService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUploadDto: UpdateUploadDto) {
    return this.uploadService.update(+id, updateUploadDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.uploadService.remove(+id);
  }
}
