import { ForbiddenException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { ICourseSection } from '../../../interfaces/sections/ICourseSection';
import { CourseRepository } from '../../../modules/learning/repositories/course.repository';
import { EditSection } from '../dtos/sections/edit-section.dto';
import { LessonRepository } from '../repositories/lesson.repository';
import { SectionRepository } from '../repositories/section.repository';
import { Section } from '../schemas/sections/section.schema';
import { Lesson } from '../schemas/lessons/lesson.schema';
import { AddSection } from '../dtos/sections/add-section.dto';

@Injectable()
export class SectionsService {
  constructor(
    private sectionRepository: SectionRepository,
    private lessonRepository: LessonRepository,
    private courseRepository: CourseRepository,
  ) {}

  async findAll(): Promise<Section[]> {
    return this.sectionRepository.find();
  }

  async findById(id: string): Promise<Section> {
    return await this.sectionRepository.findById(new Types.ObjectId(id));
  }

  async findByCourse(id: string): Promise<Section[]> {
    return await this.sectionRepository.find({ 'course._id': id });
  }

  async getLessons(id: string): Promise<Lesson[]> {
    await this.findById(id);

    const lessons = await this.lessonRepository.find({
      'section._id': id,
    });

    return lessons;
  }

  async store(addSectionDto: AddSection): Promise<Section> {
    const courseDoc = await this.courseRepository.findById(
      new Types.ObjectId(String(addSectionDto.course_id)),
    );

    const course: ICourseSection = {
      _id: courseDoc._id,
      author: new Types.ObjectId(courseDoc.author._id),
    };

    let data: Partial<Section> = {
      sect_title: addSectionDto.sect_title,
      course,
    };

    return await this.sectionRepository.create(data);
  }

  async update(
    id: string,
    editSectionDto: EditSection,
    authorId: string,
  ): Promise<Section> {
    const section: Section = await this.findById(id);

    if (String(section.course.author._id) !== authorId) {
      throw new ForbiddenException(
        "You can't update a section who don't belong to you",
      );
    }

    return this.sectionRepository.findByIdAndUpdate(
      new Types.ObjectId(id),
      editSectionDto,
    );
  }

  async delete(id: string, authorId: string): Promise<void> {
    const section = await this.findById(id);

    if (String(section.course.author._id) !== authorId) {
      throw new ForbiddenException(
        "You can't delete a section who don't belong to you",
      );
    }

    await this.sectionRepository.findByIdAndDelete(new Types.ObjectId(id));
  }
}
