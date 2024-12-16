import { Module } from '@nestjs/common';
import { LessonsService } from '../services/lessons.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Lesson, LessonSchema } from '../schemas/lessons/lesson.schema';
import {
  Section,
  sectionSchema,
} from 'src/learning/schemas/sections/section.schema';
import { LessonRepository } from '../repositories/lesson.repository';
import { SectionRepository } from '../repositories/section.repository';
import { LessonsController } from '../controllers/lessons.controller';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => ({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
      }),
    }),
    MongooseModule.forFeature([
      { name: Lesson.name, schema: LessonSchema },
      { name: Section.name, schema: sectionSchema },
    ]),
  ],
  providers: [LessonsService, LessonRepository, SectionRepository],
  controllers: [LessonsController],
})
export class LessonsModule {}
