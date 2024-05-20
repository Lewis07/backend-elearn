import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Lesson } from './schemas/lesson.schema';
import mongoose, { Model } from 'mongoose';
import { PATH_UPLOAD_LESSON } from '../utils/constant/path-upload.utils';
import { removeFileIfExist } from '../utils/removeFileIfExist.utils';
import { join } from 'path';
import { existsSync } from 'fs';
import { UploadMulter } from '../utils/upload/upload-multer.utils';
import { SaveLessonDto } from './dto/save-lesson.dto';

export type saveLesson = {
  lssn_title: string;
  lssn_video_link?: string;
  section_id: mongoose.ObjectId;
};

@Injectable()
export class LessonsService {
  constructor(@InjectModel(Lesson.name) private lessonModel: Model<Lesson>) {}

  async findAll(): Promise<Lesson[]> {
    return this.lessonModel.find();
  }

  async findById(id: string): Promise<Lesson> {
    const isvalidId = mongoose.isValidObjectId(id);

    if (!isvalidId) {
      throw new BadRequestException(
        'Wrong mongoose id, please enter a valid id',
      );
    }

    const lesson = await this.lessonModel.findById(id);

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lesson;
  }

  async store(data: saveLesson) {
    return this.lessonModel.create(data);
  }

  async update(id: string, data: any) {
    return this.lessonModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    const lesson = await this.findById(id);

    if (existsSync(join(PATH_UPLOAD_LESSON, lesson.lssn_video_link))) {
      removeFileIfExist(PATH_UPLOAD_LESSON, lesson.lssn_video_link);
    }

    return this.lessonModel.findByIdAndDelete(id);
  }

  async dataUpdate(id: string, file: Express.Multer.File, saveLessonDto: SaveLessonDto) {
    const response = await this.findById(id);

    let data = {};

    if (file != undefined) {
      if (existsSync(join(PATH_UPLOAD_LESSON, response.lssn_video_link))) {
        removeFileIfExist(PATH_UPLOAD_LESSON, response.lssn_video_link);
      }

      let videoLink = UploadMulter(file, PATH_UPLOAD_LESSON);

      if (videoLink) {
        data = {
          ...data,
          ...saveLessonDto,
          lssn_video_link: videoLink.filename,
        };
      }
    } else {
      data = {
        ...data,
        ...saveLessonDto,
      };
    }

    return data;
  }
}
