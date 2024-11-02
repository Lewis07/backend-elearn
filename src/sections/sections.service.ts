import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Course } from 'src/courses/schemas/course.schema';
import { SaveSectionDto } from './dto/save-section.dto';
import { Section } from './schemas/section.schema';
import { Lesson } from 'src/lessons/schemas/lesson.schema';

@Injectable()
export class SectionsService {
  constructor(
    @InjectModel(Section.name) private sectionModel: Model<Section>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
    @InjectModel(Lesson.name) private lessonModel: Model<Lesson>,
  ) {}

  async findAll() {
    return this.sectionModel.find().sort({ createdAt: -1 });
  }

  async findById(id: string) {
    const isvalidId = mongoose.isValidObjectId(id);

    if (!isvalidId) {
      throw new BadRequestException(
        'Wrong mongoose id, please enter a valid id',
      );
    }

    const section = await this.sectionModel.findById(id);

    if (!section) {
      throw new NotFoundException('Section not found');
    }

    return section.populate({
      path: 'course_id',
      select: '_id author_id'
    });
  }

  async getLessons(id: string) {
    await this.findById(id);
    const lessons = await this.lessonModel.find({ section: id })
                                          .populate("section", "_id sect_title");

    return lessons;
  }

  async store(data: SaveSectionDto) {
    const sectionCreated = await this.sectionModel.create(data);
    const sectionId = sectionCreated._id;
    const section = await this.findById(String(sectionId));

    return section.populate('course_id', 'crs_title');
  }

  async update(id: string, saveSection: SaveSectionDto, authorId: string) {
    const section = await this.findById(id);

    if (String(section.course_id.author_id) !== authorId) {
      throw new ForbiddenException("You can't update a section who don't belong to you");
    }

    const sectionUpdated = await this.sectionModel.findByIdAndUpdate(
      id,
      saveSection,
      { new: true },
    );

    return sectionUpdated.populate('course_id', 'crs_title');
  }

  async delete(id: string, authorId: string) {
    const section = await this.findById(id);

    if (String(section.course_id.author_id) !== authorId) {
      throw new ForbiddenException("You can't delete a section who don't belong to you");
    }

    return this.sectionModel.findByIdAndDelete(id);
  }

  async findByCourse(id: string) {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Wrong mongoose id, please enter valid id');
    }

    const course = await this.courseModel.findById(id);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return await this.sectionModel.find({ course_id: id });
  }
}
