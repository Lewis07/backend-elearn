import { ForbiddenException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { Types } from 'mongoose';
import { join } from 'path';
import { IAddLesson } from '../../../interfaces/lessons/IAddLesson';
import { IEditLesson } from '../../../interfaces/lessons/IEditLesson';
import { IExpressMulterFile } from '../../../interfaces/medias/IExpressMulterFile';
import { getPhotoFilenameAfterVideoUpload } from '../../../utils/files/getPhotoAfterVideoUpload';
import {
  PATH_UPLOAD_LESSON_PHOTOS,
  PATH_UPLOAD_LESSON_VIDEOS,
} from '../../../utils/constants/uploads/path-upload';
import { removeFileIfExist } from '../../../utils/files/removeFileIfExist';
import { UploadMulter } from '../../../utils/uploads/upload-multer';
import { AddLesson } from '../dtos/lessons/add-lesson.dto';
import { EditLesson } from '../dtos/lessons/edit-lesson.dto';
import { Lesson } from '../schemas/lessons/lesson.schema';
import { ISectionLessons } from '../../../interfaces/lessons/ISectionLessons';
import { LessonRepository } from '../repositories/lesson.repository';
import { SectionRepository } from '../repositories/section.repository';

@Injectable()
export class LessonsService {
  constructor(
    private lessonRepository: LessonRepository,
    private sectionRepository: SectionRepository,
  ) {}

  async findAll(): Promise<Lesson[]> {
    return this.lessonRepository.find();
  }

  async findById(id: string): Promise<Lesson> {
    return this.lessonRepository.findById(new Types.ObjectId(id));
  }

  async store(
    addLesson: AddLesson,
    file: Express.Multer.File,
  ): Promise<Lesson> {
    const video: IExpressMulterFile = UploadMulter(
      file,
      PATH_UPLOAD_LESSON_VIDEOS,
    );
    const videoLink: string = video.filename;
    const prefixFilename: string = 'lssn-pht';
    const lessonPhotoFilename: string = await getPhotoFilenameAfterVideoUpload(
      video,
      prefixFilename,
      PATH_UPLOAD_LESSON_PHOTOS,
    );

    const sectionData = await this.sectionRepository.findById(
      new Types.ObjectId(addLesson.section_id),
    );

    const section: ISectionLessons = {
      _id: sectionData._id,
      course: {
        _id: sectionData.course._id,
        author: sectionData.course.author,
      },
    };

    let data: IAddLesson = {
      ...addLesson,
      section,
      lssn_video_link: videoLink,
      lssn_video_photo: lessonPhotoFilename,
    };

    return await this.lessonRepository.create(data);
  }

  async update(
    id: string,
    editLesson: EditLesson,
    file: Express.Multer.File,
    authorId: string,
  ): Promise<Lesson> {
    const lesson: Lesson = await this.findById(id);

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

      const video: IExpressMulterFile = UploadMulter(
        file,
        PATH_UPLOAD_LESSON_VIDEOS,
      );
      const prefixFilename: string = 'lssn-pht';
      lessonPhotoFilename = await getPhotoFilenameAfterVideoUpload(
        video,
        prefixFilename,
        PATH_UPLOAD_LESSON_PHOTOS,
      );
      videoLink = video.filename;
    }

    let data: IEditLesson = {
      ...editLesson,
      lssn_video_photo: lessonPhotoFilename,
      lssn_video_link: videoLink,
    };

    return await this.lessonRepository.findByIdAndUpdate(
      new Types.ObjectId(id),
      data,
    );
  }

  async delete(id: string, authorId: string): Promise<void> {
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

    await this.lessonRepository.findByIdAndDelete(new Types.ObjectId(id));
  }
}
