import { Module } from '@nestjs/common';
import { CoursesController } from '../controllers/courses.controller';
import { CoursesService } from '../services/courses.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from '../schemas/course.schema';
import { JwtModule } from '@nestjs/jwt';
import { Comment, CommentSchema } from '../../comments/schemas/comment.schema';
import {
  Section,
  sectionSchema,
} from 'src/learning/schemas/sections/section.schema';
import {
  Lesson,
  LessonSchema,
} from 'src/learning/schemas/lessons/lesson.schema';
import { CourseRepository } from '../repositories/course.repository';
import { UserRepository } from 'src/users/repository/user.repository';
import { CommentRepository } from 'src/comments/repository/comment.repository';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { SectionRepository } from '../repositories/section.repository';
import { LessonRepository } from '../repositories/lesson.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
      { name: User.name, schema: UserSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Section.name, schema: sectionSchema },
      { name: Lesson.name, schema: LessonSchema },
    ]),
    JwtModule.registerAsync({
      useFactory: async () => ({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
      }),
    }),
  ],
  controllers: [CoursesController],
  providers: [
    CoursesService,
    CourseRepository,
    UserRepository,
    CommentRepository,
    SectionRepository,
    LessonRepository,
  ],
})
export class CoursesModule {}
