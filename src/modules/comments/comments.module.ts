import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from '../users/repository/user.repository';
import { User, UserSchema } from '../users/schemas/user.schema';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { CommentRepository } from './repository/comment.repository';
import { Comment, CommentSchema } from './schemas/comment.schema';
import { CourseRepository } from '../learning/repositories/course.repository';
import { Course, CourseSchema } from '../learning/schemas/course.schema';
import {
  Lesson,
  LessonSchema,
} from '../learning/schemas/lessons/lesson.schema';
import { LessonRepository } from '../learning/repositories/lesson.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Course.name, schema: CourseSchema }]),
    MongooseModule.forFeature([{ name: Lesson.name, schema: LessonSchema }]),
    JwtModule.registerAsync({
      useFactory: async () => ({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
      }),
    }),
  ],
  providers: [
    CommentsService,
    CommentRepository,
    UserRepository,
    CourseRepository,
    LessonRepository,
  ],
  controllers: [CommentsController],
})
export class CommentsModule {}
