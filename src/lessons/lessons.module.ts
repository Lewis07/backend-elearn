import { Module } from '@nestjs/common';
import { LessonsService } from './lessons.service';
import { LessonsController } from './lessons.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Lesson, LessonSchema } from './schemas/lesson.schema';
import { LessonRepository } from './repository/lesson.repository';
import { SectionRepository } from 'src/sections/repository/section.repository';
import { Section, sectionSchema } from 'src/sections/schemas/section.schema';

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
