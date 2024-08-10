import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { EditCourseDto } from './dto/edit-course.dto';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CustomUploadFileTypeValidatorOptions } from '../utils/validation/CustomUploadFileTypeValidator';
import { VALID_IMAGE_MIME_TYPES } from '../utils/constant/mime-types';
import { MAX_SIZE_IN_BYTES_UPLOAD_PHOTO } from '../utils/constant/max-size-upload';

@Controller('courses')
export class CoursesController {
  constructor(private courseService: CoursesService) {}

  @Get()
  async list() {
    return await this.courseService.findAll();
  }

  @Get('show/:id')
  async show(@Param('id') id: string) {
    return await this.courseService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Post('add')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async add(
    @Req() req: any,
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new CustomUploadFileTypeValidatorOptions({
            fileType: VALID_IMAGE_MIME_TYPES,
          }),
        )
        .addMaxSizeValidator({ maxSize: MAX_SIZE_IN_BYTES_UPLOAD_PHOTO })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    return await this.courseService.store(req.user.id, createCourseDto, file);
  }

  @UseGuards(AuthGuard)
  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async update(
    @Param('id') id: string,
    @Body() editCourseDto: EditCourseDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new CustomUploadFileTypeValidatorOptions({
            fileType: VALID_IMAGE_MIME_TYPES,
          }),
        )
        .addMaxSizeValidator({ maxSize: MAX_SIZE_IN_BYTES_UPLOAD_PHOTO })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    return await this.courseService.update(id, editCourseDto, file);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    await this.courseService.delete(id);

    return res.json({ courseId: id });
  }
}
