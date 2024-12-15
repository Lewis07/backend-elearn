import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseSchema } from './schemas/course.schema';
import { JwtModule } from '@nestjs/jwt';
import { Comment, CommentSchema } from '../comments/schemas/comment.schema';
import { Section, sectionSchema } from 'src/sections/schemas/section.schema';
import { Lesson, LessonSchema } from 'src/lessons/schemas/lesson.schema';
import { CourseRepository } from './repository/course.repository';
import { UserRepository } from 'src/users/repository/user.repository';
import { CommentRepository } from 'src/comments/repository/comment.repository';
import { User, UserSchema } from 'src/users/schemas/user.schema';

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
  ],
})
export class CoursesModule {}
