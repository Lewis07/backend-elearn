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
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { LessonsService, saveLesson } from './lessons.service';
import { AuthGuard } from '../auth/auth.guard';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomUploadFileTypeValidatorOptions } from '../utils/validation/CustomUploadFileTypeValidator';
import { memoryStorage } from 'multer';
import { MAX_SIZE_IN_BYTES_UPLOAD_VIDEO } from '../utils/constant/max-size-upload';
import { VALID_VIDEO_MIME_TYPES } from '../utils/constant/mime-types';
import { SaveLessonDto } from './dto/save-lesson.dto';
import { existsSync } from 'fs';
import { join } from 'path';
import { removeFileIfExist } from 'src/utils/removeFileIfExist.utils';

@Controller('lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @UseGuards(AuthGuard)
  @Get('list')
  async list() {
    return await this.lessonsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('show/:id')
  async show(@Param('id') id: string) {
    return await this.lessonsService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Post('add')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async add(
    @Body() saveLessonDto: SaveLessonDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new CustomUploadFileTypeValidatorOptions({
            fileType: VALID_VIDEO_MIME_TYPES,
          }),
        )
        .addMaxSizeValidator({ maxSize: MAX_SIZE_IN_BYTES_UPLOAD_VIDEO })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
  ) {
    return await this.lessonsService.store(saveLessonDto, file);
  }

  @UseGuards(AuthGuard)
  @Patch('update/:id')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async update(
    @Param('id') id: string,
    @Body() saveLessonDto,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new CustomUploadFileTypeValidatorOptions({
            fileType: VALID_VIDEO_MIME_TYPES,
          }),
        )
        .addMaxSizeValidator({ maxSize: MAX_SIZE_IN_BYTES_UPLOAD_VIDEO })
        .build({
          fileIsRequired: false,
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ) {
    return await this.lessonsService.update(id, saveLessonDto, file);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    await this.lessonsService.delete(id);

    return res.json({ lessonId: id });
  }
}
