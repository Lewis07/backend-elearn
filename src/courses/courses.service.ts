import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { existsSync } from 'fs';
import { Model, Types } from 'mongoose';
import { join } from 'path';
import slugify from 'slugify';
import { CommentRepository } from 'src/comments/repository/comment.repository';
import { IAddCourse } from 'src/interfaces/courses/IAddCourse';
import { ICourseWithAverageRating } from 'src/interfaces/courses/ICourseWithAverageRating';
import { IExpressMulterFile } from 'src/interfaces/medias/IExpressMulterFile';
import { Lesson } from 'src/lessons/schemas/lesson.schema';
import { Section } from 'src/sections/schemas/section.schema';
import { UserRepository } from 'src/users/repository/user.repository';
import { User } from 'src/users/schemas/user.schema';
import {
  getHourMinute,
  getMinute,
  getMinuteAndSecond,
  getVideoDuration,
} from 'src/utils/duration.utils';
import { UploadMulter } from 'src/utils/upload/upload-multer.utils';
import { Comment } from '../comments/schemas/comment.schema';
import {
  PATH_UPLOAD_COURSE,
  PATH_UPLOAD_LESSON_VIDEOS,
} from '../utils/constant/path-upload.utils';
import { removeFileIfExist } from '../utils/removeFileIfExist.utils';
import { CreateCourse } from './dto/create-course.dto';
import { EditCourse } from './dto/edit-course.dto';
import { CourseRepository } from './repository/course.repository';
import { Course } from './schemas/course.schema';

@Injectable()
export class CoursesService {
  constructor(
    private courseRepository: CourseRepository,
    private userRepository: UserRepository,
    private commentRepository: CommentRepository,
    @InjectModel(Section.name) private sectionModel: Model<Section>,
    @InjectModel(Lesson.name) private lessonModel: Model<Lesson>,
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
  ) {
    const course = await this.findById(id);
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

      let photo = UploadMulter(file, PATH_UPLOAD_COURSE);
      photoLink = photo.filename;
    }

    let data = {
      ...editCourseDto,
      crs_photo: photoLink,
    };

    return this.courseRepository.findByIdAndUpdate(
      new Types.ObjectId(id),
      data,
    );
  }

  async delete(id: string, authorId: string) {
    const course = await this.findById(id);

    if (String(course.author) !== authorId) {
      throw new ForbiddenException(
        "You can't delete a course who don't belong to you",
      );
    }

    if (existsSync(join(PATH_UPLOAD_COURSE, course.crs_photo))) {
      removeFileIfExist(PATH_UPLOAD_COURSE, course.crs_photo);
    }

    return this.courseRepository.findByIdAndDelete(new Types.ObjectId(id));
  }

  async getContent(courseId: string) {
    await this.findById(courseId);
    let courseContents = [];

    const sections = await this.sectionModel
      .find({ course_id: courseId })
      .select('_id sect_title');

    const totalSections = sections.length;
    let totalLessons = 0;
    let totalDuration = 0;

    for (const section of sections) {
      const sectionId = String(section._id);
      let lessonsInSection = await this.lessonModel
        .find({
          section: sectionId,
        })
        .select('_id lssn_title lssn_video_link lssn_is_free');

      totalLessons += lessonsInSection.length;

      let copyLessonInSection = [...lessonsInSection];
      let totalDurationLessonBySection = 0;

      let lessonInSectionWithDuration = await Promise.all(
        copyLessonInSection.map(async (lesson) => {
          let duration = await getVideoDuration(
            `${PATH_UPLOAD_LESSON_VIDEOS}/${lesson.lssn_video_link}`,
          );
          totalDurationLessonBySection += Number(duration);

          return {
            _id: lesson._id,
            lssn_title: lesson.lssn_title,
            lssn_video_link: lesson.lssn_video_link,
            lssn_is_free: lesson.lssn_is_free,
            lssn_duration: getMinuteAndSecond(
              await getVideoDuration(
                `${PATH_UPLOAD_LESSON_VIDEOS}/${lesson.lssn_video_link}`,
              ),
            ),
          };
        }),
      );

      totalDuration += totalDurationLessonBySection;

      courseContents = [
        ...courseContents,
        {
          section,
          lessons: lessonInSectionWithDuration,
          countLesson: lessonsInSection.length,
          countDuration: getMinute(totalDurationLessonBySection),
        },
      ];
    }

    return {
      data: courseContents,
      totalSections,
      totalLessons,
      totalDuration: getHourMinute(totalDuration),
    };
  }
}
