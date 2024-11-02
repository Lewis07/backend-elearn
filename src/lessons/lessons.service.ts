import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as ffmpeg from 'fluent-ffmpeg';
import { existsSync } from 'fs';
import mongoose, { Model } from 'mongoose';
import { join } from 'path';
import {
  PATH_UPLOAD_LESSON_PHOTOS,
  PATH_UPLOAD_LESSON_VIDEOS,
} from '../utils/constant/path-upload.utils';
import { removeFileIfExist } from '../utils/removeFileIfExist.utils';
import { UploadMulter } from '../utils/upload/upload-multer.utils';
import { SaveLessonDto } from './dto/save-lesson.dto';
import { Lesson } from './schemas/lesson.schema';
import internal from 'stream';

interface IVideoLink {
  filename: string;
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  stream: internal.Readable;
  destination: string;
  path: string;
  buffer: Buffer;
}

@Injectable()
export class LessonsService {
  constructor(@InjectModel(Lesson.name) private lessonModel: Model<Lesson>) {}

  async findAll(): Promise<Lesson[]> {
    return this.lessonModel
      .find()
      .populate('section', '_id sect_title')
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
    const video = UploadMulter(file, PATH_UPLOAD_LESSON_VIDEOS);
    const videoLink = video.filename;
    const lessonPhotoFilename = await this.savePhotoAfterVideoUpload(video);

    let data = {
      ...saveLessonDto,
      lssn_video_link: videoLink,
      lssn_video_photo: lessonPhotoFilename,
    }

    const lessonCreated = await this.lessonModel.create(data);

    return lessonCreated.populate('section', '_id sect_title');
  }

  async update(
    id: string,
    saveLessonDto: SaveLessonDto,
    file: Express.Multer.File,
  ) {
    const lesson = await this.findById(id);
    let lessonPhotoFilename: string;
    let videoLink: string;

    if (file === undefined) {
      lessonPhotoFilename = lesson.lssn_video_photo;
      videoLink = lesson.lssn_video_link;
    } else {
      if (
        lesson.lssn_video_link &&
        existsSync(join(PATH_UPLOAD_LESSON_VIDEOS, lesson.lssn_video_link))
      ) {
        removeFileIfExist(PATH_UPLOAD_LESSON_VIDEOS, lesson.lssn_video_link);
      }

      if (
        lesson.lssn_video_photo &&
        existsSync(join(PATH_UPLOAD_LESSON_PHOTOS, lesson.lssn_video_photo))
      ) {
        removeFileIfExist(PATH_UPLOAD_LESSON_PHOTOS, lesson.lssn_video_photo);
      }

      const video = UploadMulter(file, PATH_UPLOAD_LESSON_VIDEOS);
      lessonPhotoFilename = await this.savePhotoAfterVideoUpload(video); 
      videoLink = video.filename;
    }

    let data = {
      ...saveLessonDto,
      lssn_video_photo: lessonPhotoFilename,
      lssn_video_link: videoLink,
    };

    const lessonUpdated = await this.lessonModel.findByIdAndUpdate(id, data, {
      new: true,
    });

    return lessonUpdated.populate('section', '_id sect_title');
  }

  async delete(id: string) {
    const lesson = await this.findById(id);

    if (
      lesson.lssn_video_link &&
      existsSync(join(PATH_UPLOAD_LESSON_VIDEOS, lesson.lssn_video_link))
    ) {
      removeFileIfExist(PATH_UPLOAD_LESSON_VIDEOS, lesson.lssn_video_link);
    }

    if (
      lesson.lssn_video_photo &&
      existsSync(join(PATH_UPLOAD_LESSON_PHOTOS, lesson.lssn_video_photo))
    ) {
      removeFileIfExist(PATH_UPLOAD_LESSON_PHOTOS, lesson.lssn_video_photo);
    }

    return this.lessonModel.findByIdAndDelete(id);
  }

  async savePhotoAfterVideoUpload(videoLink: IVideoLink) {
    const randomName = Array(10)
      .fill(null)
      .map(() => Math.round(Math.random() * 8).toString(8))
      .join('');
    const lessonPhotoFilename = `lssn-pht-${randomName}.png`;

    await new Promise((resolve, reject) => {
      ffmpeg(videoLink.path)
        .screenshots({
          timestamps: ['00:00:01'],
          filename: lessonPhotoFilename,
          folder: PATH_UPLOAD_LESSON_PHOTOS,
        })
        .on('end', resolve)
        .on('error', (err: any) => reject(`Error capturing : ${err.message}`));
    });

    return lessonPhotoFilename;
  }
}
