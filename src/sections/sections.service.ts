import { ForbiddenException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { LessonRepository } from 'src/lessons/repository/lesson.repository';
import { SaveSection } from './dto/save-section.dto';
import { SectionRepository } from './repository/section.repository';
import { Section } from './schemas/section.schema';

@Injectable()
export class SectionsService {
  constructor(
    private sectionRepository: SectionRepository,
    private lessonRepository: LessonRepository,
  ) {}

  async findAll(): Promise<Section[]> {
    return this.sectionRepository.find();
  }

  async findById(id: string) {
    const section = await this.sectionRepository.findById(
      new Types.ObjectId(id),
    );

    const sectionDetailed = section.populate({
      path: 'course',
      select: '_id author_id',
    });

    return sectionDetailed;
  }

  async findByCourse(id: string): Promise<Section[]> {
    return await this.sectionRepository.find({ course: id });
  }

  async getLessons(id: string) {
    await this.findById(id);
    const lessons = await this.lessonRepository.find({ section: id });
    // .populate('section', '_id sect_title');

    return lessons;
  }

  async store(data: SaveSection) {
    const sectionCreated = await this.sectionRepository.create(data);
    const sectionId = sectionCreated._id;
    const section = await this.findById(String(sectionId));

    return section.populate('course', 'crs_title');
  }

  async update(id: string, saveSection: SaveSection, authorId: string) {
    const sectionData = await this.findById(id);
    const section = await sectionData.populate('course', 'crs_title author');

    if (String(section.course.author) !== authorId) {
      throw new ForbiddenException(
        "You can't update a section who don't belong to you",
      );
    }

    const sectionUpdated = await this.sectionRepository.findByIdAndUpdate(
      new Types.ObjectId(id),
      saveSection,
    );

    const sectionPopulated = await this.findById(String(sectionUpdated._id));

    return sectionPopulated.populate('course', 'crs_title');
  }

  async delete(id: string, authorId: string) {
    const sectionData = await this.findById(id);
    const section = await sectionData.populate('course', 'author');

    if (String(section.course.author) !== authorId) {
      throw new ForbiddenException(
        "You can't delete a section who don't belong to you",
      );
    }

    await this.sectionRepository.findByIdAndDelete(new Types.ObjectId(id));
  }
}
