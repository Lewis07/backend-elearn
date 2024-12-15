import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { existsSync } from 'fs';
import mongoose, { Model } from 'mongoose';
import { join } from 'path';
import { getPhotoFilenameAfterVideoUpload } from 'src/utils/getPhotoAfterVideoUpload';
import {
  PATH_UPLOAD_LESSON_PHOTOS,
  PATH_UPLOAD_LESSON_VIDEOS,
} from '../utils/constant/path-upload.utils';
import { removeFileIfExist } from '../utils/removeFileIfExist.utils';
import { UploadMulter } from '../utils/upload/upload-multer.utils';
import { SaveLessonDto } from './dto/save-lesson.dto';
import { Lesson } from './schemas/lesson.schema';

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
    const lessonDetailed = lesson.populate({
      path: 'section',
      populate: {
        path: 'course_id',
        select: '_id author_id',
      },
    });

    if (!lesson) {
      throw new NotFoundException('Lesson not found');
    }

    return lessonDetailed;
  }

  async store(saveLessonDto: SaveLessonDto, file: Express.Multer.File) {
    const video = UploadMulter(file, PATH_UPLOAD_LESSON_VIDEOS);
    const videoLink = video.filename;
    const prefixFilename = 'lssn-pht';
    const lessonPhotoFilename = await getPhotoFilenameAfterVideoUpload(
      video,
      prefixFilename,
      PATH_UPLOAD_LESSON_PHOTOS,
    );

    let data = {
      ...saveLessonDto,
      lssn_video_link: videoLink,
      lssn_video_photo: lessonPhotoFilename,
    };

    const lessonCreated = await this.lessonModel.create(data);

    return lessonCreated.populate('section', '_id sect_title');
  }

  async update(
    id: string,
    saveLessonDto: SaveLessonDto,
    file: Express.Multer.File,
    authorId: string,
  ) {
    const lesson = await this.findById(id);

    if (String(lesson.section.course.author) !== authorId) {
      throw new ForbiddenException(
        "You can't update a lesson who don't belong to you",
      );
    }

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
      const prefixFilename = 'lssn-pht';
      lessonPhotoFilename = await getPhotoFilenameAfterVideoUpload(
        video,
        prefixFilename,
        PATH_UPLOAD_LESSON_PHOTOS,
      );
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

  async delete(id: string, authorId: string) {
    const lesson = await this.findById(id);

    if (String(lesson.section.course.author) !== authorId) {
      throw new ForbiddenException(
        "You can't delete a lesson who don't belong to you",
      );
    }

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
}
