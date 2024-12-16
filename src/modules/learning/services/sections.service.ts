import { ForbiddenException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { CourseRepository } from 'src/modules/learning/repositories/course.repository';
import { ICourseSections } from 'src/interfaces/sections/ICourseSections';
import { CreateSection } from '../dtos/sections/create-section.dto';
import { EditSection } from '../dtos/sections/edit-section.dto';
import { Section } from '../schemas/sections/section.schema';
import { SectionRepository } from '../repositories/section.repository';
import { LessonRepository } from '../repositories/lesson.repository';

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

  async getLessons(id: string) {
    await this.findById(id);
    const lessons = await this.lessonRepository.find({
      'section._id': id,
    });

    return lessons;
  }

  async store(createSection: CreateSection): Promise<Section> {
    const course = await this.courseRepository.findById(
      new Types.ObjectId(String(createSection.course_id)),
    );

    const courseSections: ICourseSections = {
      _id: course._id,
      author: course.author._id,
    };

    let sectionToCreate = {
      sect_title: createSection.sect_title,
      course: courseSections,
    };

    return await this.sectionRepository.create(sectionToCreate);
  }

  async update(
    id: string,
    editSection: EditSection,
    authorId: string,
  ): Promise<Section> {
    const section = await this.findById(id);

    if (String(section.course.author) !== authorId) {
      throw new ForbiddenException(
        "You can't update a section who don't belong to you",
      );
    }

    return this.sectionRepository.findByIdAndUpdate(
      new Types.ObjectId(id),
      editSection,
    );
  }

  async delete(id: string, authorId: string): Promise<void> {
    const section = await this.findById(id);

    if (String(section.course.author) !== authorId) {
      throw new ForbiddenException(
        "You can't delete a section who don't belong to you",
      );
    }

    await this.sectionRepository.findByIdAndDelete(new Types.ObjectId(id));
  }
}
