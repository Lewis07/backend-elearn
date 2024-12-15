import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Lesson, LessonSchema } from 'src/lessons/schemas/lesson.schema';
import { SectionRepository } from './repository/section.repository';
import { Section, sectionSchema } from './schemas/section.schema';
import { SectionsController } from './sections.controller';
import { SectionsService } from './sections.service';
import { LessonRepository } from 'src/lessons/repository/lesson.repository';

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
      { name: Section.name, schema: sectionSchema },
      { name: Lesson.name, schema: LessonSchema },
    ]),
  ],
  controllers: [SectionsController],
  providers: [SectionsService, SectionRepository, LessonRepository],
})
export class SectionsModule {}
