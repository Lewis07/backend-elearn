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
import * as ffmpeg from 'fluent-ffmpeg';

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

    const pathVideoLesson = `${PATH_UPLOAD_LESSON}/videos`;
    const videoLink = UploadMulter(file, pathVideoLesson);
    const randomName = Array(10).fill(null).map(() => (Math.round(Math.random() * 8)).toString(8)).join('');
    const pathPhotoLesson =  `${PATH_UPLOAD_LESSON}/photos`;
    const lessonPhotoFilename = `lssn-pht-${randomName}.png`;

    await new Promise((resolve, reject) => {
      ffmpeg(videoLink.path)
        .screenshots({
          timestamps: ['00:00:01'],
          filename: lessonPhotoFilename,
          folder: pathPhotoLesson,
        })
        .on('end', resolve)
        .on('error', (err) => reject(`Error capturing : ${err.message}`));
    });

    if (videoLink) {
      data = {
        ...data,
        lssn_video_link: videoLink.filename,
        lssn_video_photo: lessonPhotoFilename,
      };
    } else {
      data = {
        ...data,
        lssn_video_link: null,
        lssn_video_photo: null
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
      if (lesson.lssn_video_link && existsSync(join(PATH_UPLOAD_LESSON, lesson.lssn_video_link))) {
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
    const pathVideoLesson = `${PATH_UPLOAD_LESSON}/videos`;
    const pathPhotoLesson = `${PATH_UPLOAD_LESSON}/photos`;

    if (lesson.lssn_video_link && existsSync(join(pathVideoLesson, lesson.lssn_video_link))) {
      removeFileIfExist(pathVideoLesson, lesson.lssn_video_link);
    }

    if (lesson.lssn_video_photo && existsSync(join(pathPhotoLesson, lesson.lssn_video_photo))) {
      removeFileIfExist(pathPhotoLesson, lesson.lssn_video_photo);
    }

    return this.lessonModel.findByIdAndDelete(id);
  }
}
