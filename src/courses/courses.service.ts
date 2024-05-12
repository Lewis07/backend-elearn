import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course } from './schemas/course.schema';
import mongoose, { Model } from 'mongoose';
import { EditCourseDto } from './dto/edit-course.dto';

@Injectable()
export class CoursesService {
    constructor(@InjectModel(Course.name) private courseModel: Model<Course>) {}

    async findAll() {
        return this.courseModel.find();
    }
    
    async findById(id: string) {
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
            throw new BadRequestException("Wrong mongoose id, please enter valid id");
        }

        const course = await this.courseModel.findById(id);
        
        if (!course) {
            throw new NotFoundException("Course not found"); 
        }

        return course;
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
