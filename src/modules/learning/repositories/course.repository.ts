import { AbstractRepository } from '../../../common/repository/abstract.repository';
import { Course } from '../schemas/course.schema';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class CourseRepository extends AbstractRepository<Course> {
  protected logger: Logger = new Logger();

  constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {
    super(courseModel);
  }
}
