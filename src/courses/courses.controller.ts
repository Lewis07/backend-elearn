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
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiResponse,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { Response } from 'express';
import { memoryStorage } from 'multer';
import { ICourseWithAverageRating } from 'src/interfaces/courses/ICourseWithAverageRating';
import { AuthGuard } from '../auth/auth.guard';
import { MAX_SIZE_IN_BYTES_UPLOAD_PHOTO } from '../utils/constant/max-size-upload';
import { VALID_IMAGE_MIME_TYPES } from '../utils/constant/mime-types';
import { CustomUploadFileTypeValidatorOptions } from '../utils/validation/CustomUploadFileTypeValidator';
import { CoursesService } from './courses.service';
import { CreateCourse } from './dto/create-course.dto';
import { EditCourse } from './dto/edit-course.dto';
import { Course } from './schemas/course.schema';

@Controller('courses')
export class CoursesController {
  constructor(private courseService: CoursesService) {}

  @Get()
  async list(): Promise<ICourseWithAverageRating[]> {
    return await this.courseService.findAll();
  }

  @Get('show/:id')
  async showById(@Param('id') id: string): Promise<Course> {
    return await this.courseService.findById(id);
  }

  @Get('view/:slug')
  async viewBySlug(
    @Param('slug') slug: string,
  ): Promise<ICourseWithAverageRating> {
    return await this.courseService.findBySlug(slug);
  }

  @Get('contents/:id')
  async contents(@Param('id') id: string) {
    return this.courseService.getContent(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiCreatedResponse({
    description: 'The record has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'Fields required.',
  })
  @ApiUnprocessableEntityResponse({
    description: 'File is required.',
  })
  async add(
    @Req() req: any,
    @Body() createCourseDto: CreateCourse,
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
  ): Promise<Course> {
    return await this.courseService.store(req.user.id, createCourseDto, file);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  async update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() editCourseDto: EditCourse,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(
          new CustomUploadFileTypeValidatorOptions({
            fileType: VALID_IMAGE_MIME_TYPES,
          }),
        )
        .addMaxSizeValidator({ maxSize: MAX_SIZE_IN_BYTES_UPLOAD_PHOTO })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          fileIsRequired: false,
        }),
    )
    file: Express.Multer.File,
  ) {
    return await this.courseService.update(
      id,
      editCourseDto,
      file,
      req.user.id,
    );
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: any, @Res() res: Response) {
    await this.courseService.delete(id, req.user.id);

    return res.json({ courseId: id });
  }
}
