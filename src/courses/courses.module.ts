import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './schemas/course.schema';
import { JwtModule } from '@nestjs/jwt';
import { Comment, CommentSchema } from '../comments/schemas/comment.schema';
import { Section, sectionSchema } from 'src/sections/schemas/section.schema';
import { Lesson, LessonSchema } from 'src/lessons/schemas/lesson.schema';
import { LessonsService } from 'src/lessons/lessons.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Course.name, schema: CourseSchema },
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
  providers: [CoursesService, LessonsService],
})
export class CoursesModule {}
