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
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { AuthGuard } from '../auth/auth.guard';
import { MAX_SIZE_IN_BYTES_UPLOAD_VIDEO } from '../utils/constant/max-size-upload';
import { VALID_VIDEO_MIME_TYPES } from '../utils/constant/mime-types';
import { CustomUploadFileTypeValidatorOptions } from '../utils/validation/CustomUploadFileTypeValidator';
import { AddLesson } from './dto/add-lesson.dto';
import { EditLesson } from './dto/edit-lesson.dto';
import { LessonsService } from './lessons.service';
import { Lesson } from './schemas/lesson.schema';

@Controller('lessons')
@ApiBearerAuth()
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'The lessons have been successfully retrieved.',
  })
  async list(): Promise<Lesson[]> {
    return await this.lessonsService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'The lesson have been successfully retrieved.',
  })
  async show(@Param('id') id: string): Promise<Lesson> {
    return await this.lessonsService.findById(id);
  }

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({
    description: 'The lesson has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'Fields required.',
  })
  @ApiForbiddenResponse({
    description: 'You are not authorized to update the lesson.',
  })
  @ApiUnprocessableEntityResponse({
    description: 'File is required.',
  })
  async add(
    @Body() addLesson: AddLesson,
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
  ): Promise<Lesson> {
    return await this.lessonsService.store(addLesson, file);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiConsumes('multipart/form-data')
  @ApiOkResponse({
    description: 'The lesson has been successfully updated.',
  })
  @ApiBadRequestResponse({
    description: 'Fields required.',
  })
  @ApiForbiddenResponse({
    description: 'You are not authorized to update the lesson.',
  })
  @ApiUnprocessableEntityResponse({
    description: 'File is required.',
  })
  async update(
    @Param('id') id: string,
    @Body() editLesson: EditLesson,
    @Req() req: any,
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
  ): Promise<Lesson> {
    return await this.lessonsService.update(id, editLesson, file, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  @ApiNoContentResponse({
    description: 'The lesson have been successfully deleted.',
  })
  async delete(@Param('id') id: string, @Req() req: any): Promise<void> {
    await this.lessonsService.delete(id, req.user.id);
  }
}
