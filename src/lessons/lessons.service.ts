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

@Injectable()
export class LessonsService {
  constructor(@InjectModel(Lesson.name) private lessonModel: Model<Lesson>) {}

  async findAll(): Promise<Lesson[]> {
    return this.lessonModel
      .find()
      .populate("section", "_id sect_title")
      .sort({ createdAt: -1 });
  }

  async findById(id: string) {
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

  async store(saveLessonDto: SaveLessonDto, file: Express.Multer.File) {
    let data = {
      ...saveLessonDto,
    };

    let videoLink = UploadMulter(file, PATH_UPLOAD_LESSON);

    if (videoLink) {
      data = {
        ...data,
        lssn_video_link: videoLink.filename,
      };
    } else {
      data = {
        ...data,
        lssn_video_link: null,
      };
    }

    const lessonCreated = await this.lessonModel.create(data);

    return lessonCreated.populate("section", "_id sect_title");
  }

  async update(
    id: string,
    saveLessonDto: SaveLessonDto,
    file: Express.Multer.File,
  ) {
    const lesson = await this.findById(id);

    let data = {
      ...saveLessonDto,
    };

    if (file != undefined) {
      if (existsSync(join(PATH_UPLOAD_LESSON, lesson.lssn_video_link))) {
        removeFileIfExist(PATH_UPLOAD_LESSON, lesson.lssn_video_link);
      }

      let videoLink = UploadMulter(file, PATH_UPLOAD_LESSON);

      if (videoLink) {
        data = {
          ...data,
          lssn_video_link: videoLink.filename,
        };
      }
    } else {
      data = {
        ...data,
        lssn_video_link: null,
      };
    }

    const lessonUpdated = await this.lessonModel.findByIdAndUpdate(id, data, { new: true });

    return lessonUpdated.populate("section", "_id sect_title");
  }

  async delete(id: string) {
    const lesson = await this.findById(id);

    if (existsSync(join(PATH_UPLOAD_LESSON, lesson.lssn_video_link))) {
      removeFileIfExist(PATH_UPLOAD_LESSON, lesson.lssn_video_link);
    }

    return this.lessonModel.findByIdAndDelete(id);
  }
}
