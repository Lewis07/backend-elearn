import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from 'src/common/repository/abstract.repository';
import { Lesson } from '../schemas/lessons/lesson.schema';

export class LessonRepository extends AbstractRepository<Lesson> {
  protected logger: Logger = new Logger();

  constructor(@InjectModel(Lesson.name) private lessonModel: Model<Lesson>) {
    super(lessonModel);
  }
}
