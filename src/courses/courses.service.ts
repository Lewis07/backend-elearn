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

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
  ) {}

  async findAll() {
    let courses = await this.courseModel.find();
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

  async store(authorId: string, createCourseDto: CreateCourseDto) {
    let data = {};
    data = {
      ...data,
      ...createCourseDto,
      author_id: authorId,
    };

    return this.courseModel.create(data);
  }

  async update(id: string, editCourseDto: EditCourseDto) {
    await this.findById(id);

    return this.courseModel.findByIdAndUpdate(id, editCourseDto, { new: true });
  }

  async delete(id: string) {
    await this.findById(id);

    return this.courseModel.findByIdAndDelete(id);
  }
}
