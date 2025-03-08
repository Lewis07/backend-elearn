import { ForbiddenException, Injectable } from '@nestjs/common';
import { existsSync } from 'fs';
import { Types } from 'mongoose';
import { join } from 'path';
import slugify from 'slugify';
import { CommentRepository } from '../../../modules/comments/repository/comment.repository';
import { IAddCourse } from '../../../interfaces/courses/IAddCourse';
import { ICourseContents } from '../../../interfaces/courses/ICourseContents';
import { ICourseContentsWithTotalSectionsLessonsDuration } from '../../../interfaces/courses/ICourseContentsWithTotalSectionsLessonsDuration';
import { ICourseWithAverageRating } from '../../../interfaces/courses/ICourseWithAverageRating';
import { IEditCourse } from '../../../interfaces/courses/IEditCourse';
import { ILessonInSectionWithDuration } from '../../../interfaces/lessons/ILessonInSectionWithDuration';
import { IExpressMulterFile } from '../../../interfaces/medias/IExpressMulterFile';
import { Lesson } from '../../../modules/learning/schemas/lessons/lesson.schema';
import { Section } from '../../../modules/learning/schemas/sections/section.schema';
import { UserRepository } from '../../../modules/users/repository/user.repository';
import { User } from '../../../modules/users/schemas/user.schema';
import {
  getHourMinute,
  getMinute,
  getMinuteAndSecond,
  getVideoDuration,
} from '../../../utils/times/duration';
import { UploadMulter } from '../../../utils/uploads/upload-multer';
import { Comment } from '../../comments/schemas/comment.schema';
import {
  PATH_UPLOAD_COURSE,
  PATH_UPLOAD_LESSON_VIDEOS,
} from '../../../utils/constants/uploads/path-upload';
import { removeFileIfExist } from '../../../utils/files/removeFileIfExist';
import { CreateCourse } from '../dtos/courses/create-course.dto';
import { EditCourse } from '../dtos/courses/edit-course.dto';
import { CourseRepository } from '../repositories/course.repository';
import { Course } from '../schemas/course.schema';
import { SectionRepository } from '../repositories/section.repository';
import { LessonRepository } from '../repositories/lesson.repository';

@Injectable()
export class CoursesService {
  constructor(
    private courseRepository: CourseRepository,
    private userRepository: UserRepository,
    private commentRepository: CommentRepository,
    private sectionRepository: SectionRepository,
    private lessonRepository: LessonRepository,
  ) {}

  async findAll(): Promise<ICourseWithAverageRating[]> {
    let courses: Course[] = await this.courseRepository.find();
    let courseWithAverageRating: ICourseWithAverageRating[] = [];

    for (const course of courses) {
      const comments: Comment[] = await this.commentRepository.find({
        course: course._id,
      });

      let averageRating: number = 0;
      let totalCommentByCourse: number = comments.length;

      if (totalCommentByCourse !== 0) {
        let totalRatingByCourse: number = comments.reduce(
          (accumulator: number, comment: Comment) =>
            accumulator + Number(comment.comm_rating),
          0,
        );
        averageRating =
          Number(totalRatingByCourse) / Number(totalCommentByCourse);
        averageRating = Number(averageRating.toFixed(1));
      }

      courseWithAverageRating = [
        ...courseWithAverageRating,
        {
          course,
          averageRating,
          totalCommentByCourse,
        },
      ];
    }

    return courseWithAverageRating;
  }

  async findById(id: string): Promise<Course> {
    return this.courseRepository.findById(new Types.ObjectId(id));
  }

  async findBySlug(slug: string): Promise<ICourseWithAverageRating> {
    const course: Course = await this.courseRepository.findOne({
      crs_slug: slug,
    });
    let courseWithAverageRating: ICourseWithAverageRating | {} = {};
    let averageRating: number = 0;

    const comments: Comment[] = await this.commentRepository.find({
      course: course._id,
    });
    let totalCommentByCourse: number = comments.length;

    if (totalCommentByCourse !== 0) {
      let totalRatingByCourse: number = comments.reduce(
        (accumulator: number, comment: Comment) =>
          accumulator + Number(comment.comm_rating),
        0,
      );
      averageRating = totalRatingByCourse / totalCommentByCourse;
      averageRating = Number(averageRating.toFixed(1));
    }

    return {
      ...courseWithAverageRating,
      course,
      averageRating,
      totalCommentByCourse,
    };
  }

  async store(
    authorId: string,
    createCourseDto: CreateCourse,
    file: Express.Multer.File,
  ): Promise<Course> {
    const author: User = await this.userRepository.findById(
      new Types.ObjectId(authorId),
    );

    let data: IAddCourse = {
      ...createCourseDto,
      author,
      crs_slug: slugify(createCourseDto.crs_title),
    };

    let photoLink: IExpressMulterFile = UploadMulter(file, PATH_UPLOAD_COURSE);

    if (photoLink) {
      data = { ...data, crs_photo: photoLink.filename };
    } else {
      data = { ...data, crs_photo: null };
    }

    return this.courseRepository.create(data);
  }

  async update(
    id: string,
    editCourseDto: EditCourse,
    file: Express.Multer.File,
    authorId: string,
  ): Promise<Course> {
    const course: Course = await this.findById(id);
    if (String(course.author) !== authorId) {
      throw new ForbiddenException(
        "You can't update a course who don't belong to you",
      );
    }

    let photoLink: string;

    if (file === undefined) {
      photoLink = course.crs_photo;
    } else {
      if (existsSync(join(PATH_UPLOAD_COURSE, course.crs_photo))) {
        removeFileIfExist(PATH_UPLOAD_COURSE, course.crs_photo);
      }

      let photo: IExpressMulterFile = UploadMulter(file, PATH_UPLOAD_COURSE);
      photoLink = photo.filename;
    }

    let data: IEditCourse = {
      ...editCourseDto,
      crs_photo: photoLink,
    };

    return this.courseRepository.findByIdAndUpdate(
      new Types.ObjectId(id),
      data,
    );
  }

  async delete(id: string, authorId: string): Promise<void> {
    const course: Course = await this.findById(id);

    if (String(course.author) !== authorId) {
      throw new ForbiddenException(
        "You can't delete a course who don't belong to you",
      );
    }

    if (existsSync(join(PATH_UPLOAD_COURSE, course.crs_photo))) {
      removeFileIfExist(PATH_UPLOAD_COURSE, course.crs_photo);
    }

    this.courseRepository.findByIdAndDelete(new Types.ObjectId(id));
  }

  async getContent(
    courseId: string,
  ): Promise<ICourseContentsWithTotalSectionsLessonsDuration> {
    const course = await this.findById(courseId);
    let courseContents: ICourseContents[] = [];

    const sections: Section[] = await this.sectionRepository.find({
      course: {
        _id: new Types.ObjectId(courseId),
        author: new Types.ObjectId(course.author._id),
      },
    });

    const totalSections: number = sections.length;
    let totalLessons: number = 0;
    let totalDuration: number = 0;

    for (const section of sections) {
      const sectionDoc: Section = await this.sectionRepository.findById(
        new Types.ObjectId(section._id),
      );

      let lessonsInSection: Lesson[] = await this.lessonRepository.find({
        'section._id': sectionDoc._id,
      });

      totalLessons += lessonsInSection.length;

      let totalDurationLessonBySection: number = 0;

      let lessonsInSectionWithDuration: ILessonInSectionWithDuration[] =
        await Promise.all(
          [...lessonsInSection].map(async (lesson) => {
            let duration: number = await getVideoDuration(
              `${PATH_UPLOAD_LESSON_VIDEOS}/${lesson.lssn_video_link}`,
            );

            totalDurationLessonBySection += Number(duration);

            return {
              _id: lesson._id,
              lssn_title: lesson.lssn_title,
              lssn_video_link: lesson.lssn_video_link,
              lssn_is_free: lesson.lssn_is_free,
              lssn_duration_in_min_sec: getMinuteAndSecond(duration),
            };
          }),
        );

      totalDuration += totalDurationLessonBySection;

      courseContents = [
        ...courseContents,
        {
          section,
          lessons: lessonsInSectionWithDuration,
          countLesson: lessonsInSection.length,
          countDurationInMinute: getMinute(totalDurationLessonBySection),
        },
      ];
    }

    return {
      courseContents,
      totalSections,
      totalLessons,
      totalDuration: getHourMinute(totalDuration),
    };
  }
}
