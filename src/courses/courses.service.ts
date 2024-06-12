import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './schemas/course.schema';
import mongoose, { Model } from 'mongoose';
import { EditCourseDto } from './dto/edit-course.dto';
import { Comment } from '../comments/schemas/comment.schema';
import { existsSync } from 'fs';
import { join } from 'path';
import { PATH_UPLOAD_COURSE } from '../utils/constant/path-upload.utils';
import { removeFileIfExist } from '../utils/removeFileIfExist.utils';
import { UploadMulter } from 'src/utils/upload/upload-multer.utils';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async findAll() {
    let courses = await this.courseModel.find().sort({ _id: -1 });
    let courseWithAverageRating = [];

    for (const course of courses) {
      const comments = await this.commentModel.find({ course_id: course._id });

      let averageRating = 0;
      let totalCommentByCourse = await this.commentModel.countDocuments({
        course_id: course._id,
      });

      if (totalCommentByCourse !== 0) {
        let totalRatingByCourse = comments.reduce((accumulator: number, comment: Comment) => accumulator + Number(comment.comm_rating), 0);
        averageRating = Number(totalRatingByCourse) / Number(totalCommentByCourse);
        averageRating = Number(averageRating.toFixed(2));
      } 

      courseWithAverageRating = [...courseWithAverageRating, {
        course,
        averageRating,
        totalCommentByCourse
      }]
    }

    return courseWithAverageRating;
  }

  async findById(id: string) {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Wrong mongoose id, please enter valid id');
    }

    const course = await this.courseModel.findById(id);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async store(authorId: string, createCourseDto: CreateCourseDto, file: Express.Multer.File) {
    let data = {
      ...createCourseDto,
      author_id: authorId
    };

    let photoLink = UploadMulter(file, PATH_UPLOAD_COURSE);

    if (photoLink) {
      data = { ...data, crs_photo: photoLink.filename };
    } else {
      data = { ...data, crs_photo: null };
    }

    return this.courseModel.create(data);
  }

  async update(id: string, editCourseDto: EditCourseDto, file: Express.Multer.File) {
    const course = await this.findById(id);

    let data = {
      ...editCourseDto
    };

    if (file != undefined) {
      if (existsSync(join(PATH_UPLOAD_COURSE, course.crs_photo))) {
        removeFileIfExist(PATH_UPLOAD_COURSE, course.crs_photo);
      }

      let photoLink = UploadMulter(file, PATH_UPLOAD_COURSE);

      if (photoLink) {
        data = {
          ...data,
          crs_photo: photoLink.filename,
        };
      }
    } else {
      data = {
        ...data,
        crs_photo: null,
      };
    }

    return this.courseModel.findByIdAndUpdate(id, data, { new: true });
  }

  async delete(id: string) {
    const course = await this.findById(id);

    if (existsSync(join(PATH_UPLOAD_COURSE, course.crs_photo))) {
      removeFileIfExist(PATH_UPLOAD_COURSE, course.crs_photo);
    }

    return this.courseModel.findByIdAndDelete(id);
  }
}
