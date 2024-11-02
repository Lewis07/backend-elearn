import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AuthGuard } from '../auth/auth.guard';
import { MAX_SIZE_IN_BYTES_UPLOAD_VIDEO } from '../utils/constant/max-size-upload';
import { VALID_VIDEO_MIME_TYPES } from '../utils/constant/mime-types';
import { CustomUploadFileTypeValidatorOptions } from '../utils/validation/CustomUploadFileTypeValidator';
import { SaveLessonDto } from './dto/save-lesson.dto';
import { LessonsService } from './lessons.service';

@Controller('lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @UseGuards(AuthGuard)
  @Get()
  async list() {
    return await this.lessonsService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async show(@Param('id') id: string) {
    return await this.lessonsService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Post()
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
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async update(
    @Param('id') id: string,
    @Body() saveLessonDto,
    @Req() req:any,
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
    return await this.lessonsService.update(id, saveLessonDto, file, req.user.id);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req:any) {
    await this.lessonsService.delete(id, req.user.id);
  }
}
