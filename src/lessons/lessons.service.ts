import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Lesson } from './schemas/lesson.schema';
import mongoose, { Model } from 'mongoose';
import { SaveLessonDto } from './dto/save-lesson.dto';

export type saveLesson = {
    lssn_title: string;
    lssn_video_link: string;
    section_id: mongoose.ObjectId;
}

@Injectable()
export class LessonsService {
    constructor(@InjectModel(Lesson.name) private lessonModel: Model<Lesson>) {}

    async findAll() {
        return this.lessonModel.find();
    }
    
    async findById(id: string) {
        const isvalidId = mongoose.isValidObjectId(id);

        if (!isvalidId) {
            throw new BadRequestException("Wrong mongoose id, please enter a valid id");
        }

        const lesson = await this.lessonModel.findById(id);

        if (!lesson) {
            throw new NotFoundException("Lesson not found");
        }

        return lesson;
    }

    async store (lesson: saveLesson) {
        return this.lessonModel.create(lesson);
    }

    async update(id: string, lesson: saveLesson) {
        await this.findById(id);

        return this.lessonModel.findByIdAndUpdate(id, lesson, { new: true });
    }

    async delete(id: string) {
        await this.findById(id);

        return this.lessonModel.findByIdAndDelete(id);
    }
}
