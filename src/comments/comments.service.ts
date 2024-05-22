import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './schemas/comment.schema';
import mongoose, { Model } from 'mongoose';
import { AddCommentDto } from './dto/add-comment.dto';
import { EditCommentDto } from './dto/edit-comment.dto';
import { CoursesService } from '../courses/courses.service';

@Injectable()
export class CommentsService {
    constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>, 
                private courseService: CoursesService) {}

    async findAll(){
        const comments = await this.commentModel.find();

        return comments;
    }

    async findById(id: string): Promise<Comment> {
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
            throw new BadRequestException("Wrong mongoose id, please enter valid id");
        }

        const comment = await this.commentModel.findById(id);
        
        if (!comment) {
            throw new NotFoundException("Comment not found"); 
        }

        return comment;
    }

    async store (authorId: string, addCommentDto: AddCommentDto): Promise<Comment> {
        let data = {};
        data = {
            ...data,
            ...addCommentDto,
            author_id: authorId
        };

        return this.commentModel.create(data);
    }

    async update(id: string, editCommentDto: EditCommentDto): Promise<Comment> {
        await this.findById(id);

        return this.commentModel.findByIdAndUpdate(id, editCommentDto, { new: true });
    }

    async delete(id: string): Promise<Comment> {
        await this.findById(id);

        return this.commentModel.findByIdAndDelete(id);
    }
}
