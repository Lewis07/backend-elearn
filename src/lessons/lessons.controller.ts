import { Body, Controller, Delete, Get, HttpStatus, InternalServerErrorException, Param, ParseFilePipeBuilder, Patch, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { AuthGuard } from '../auth/auth.guard';
import { SaveLessonDto } from './dto/save-lesson.dto';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { CustomUploadFileTypeValidatorOptions } from '../utils/validation/CustomUploadFileTypeValidator';
import { memoryStorage } from 'multer';
import { UploadMulter } from '../utils/upload/upload-multer.utils';
import { PATH_UPLOAD_LESSON } from '../utils/constant/path-upload.utils';
import { VALID_IMAGE_MIME_TYPES } from '../utils/constant/mime-types';
import { MAX_SIZE_IN_BYTES_UPLOAD } from '../utils/constant/max-size-upload';

@Controller('lessons')
export class LessonsController {
    constructor( private lessonsService: LessonsService ) {}

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
    async add(@Body() saveLessonDto: SaveLessonDto) {
      return await this.lessonsService.store(saveLessonDto);
    }

    @UseGuards(AuthGuard)
    @Patch('update/:id')
    async update(@Param('id') id: string, @Body() saveLessonDto: SaveLessonDto) {
        return await this.lessonsService.update(id, saveLessonDto);
    }

    @UseGuards(AuthGuard)
    @Delete('delete/:id')
    async delete(@Param('id') id: string, @Res() res: Response) {
        await this.lessonsService.delete(id);

        return res.json({ lessonId: id });
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
    upload(@UploadedFile(
        new ParseFilePipeBuilder()
            .addValidator(new CustomUploadFileTypeValidatorOptions({
                fileType: VALID_IMAGE_MIME_TYPES
            }))
            .addMaxSizeValidator({ maxSize: MAX_SIZE_IN_BYTES_UPLOAD })
            .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY })
    ) file: Express.Multer.File)
    {
        try {
            return UploadMulter(file, PATH_UPLOAD_LESSON);
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException();
        }
    }
}
