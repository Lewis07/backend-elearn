import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './schemas/course.schema';
import { Model } from 'mongoose';
import { EditCourseDto } from './dto/edit-course.dto';

@Injectable()
export class CoursesService {
    constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

    async findAll() {
        return this.courseModel.find();
    }
    
    async findById(id: string) {
        return this.courseModel.findById(id);
    }

    async store (authorId: string, createCourseDto: CreateCourseDto) {
        let data = {};
        data = {
            ...data,
            ...createCourseDto,
            author_id: authorId
        };

        return this.courseModel.create(data);
    }

    async update(id: string, editCourseDto: EditCourseDto) {
        return this.courseModel.findByIdAndUpdate(id, editCourseDto, { new: true });
    }

    async delete(id: string) {
        return this.courseModel.findByIdAndDelete(id);
    }
}
