import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './schemas/comment.schema';
import mongoose, { Model } from 'mongoose';
import { AddCommentDto } from './dto/add-comment.dto';
import { EditCommentDto } from './dto/edit-comment.dto';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class CommentsService {
    constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>, 
                @InjectModel(User.name) private userModel: Model<User>, 
                ) {}

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
            author_id: authorId,
            comm_count_like: 0,
            comm_liked_by: [],
            comm_count_dislike: 0,
            comm_disliked_by: []
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

    async like(id: string, likeByUserId: string): Promise<Comment> {
        const likeByUser = await this.userModel.findById(likeByUserId); 

        if (!likeByUser) {
            throw new NotFoundException("User not found"); 
        }

        let countLike = 0;
        const hasAlreadyLiked = await this.commentModel.findOne({ comm_liked_by: likeByUserId });
        const comment = await this.findById(id);

        if (hasAlreadyLiked && hasAlreadyLiked.comm_count_like > 0) {
            countLike = Number(comment.comm_count_like) - 1;

            return this.commentModel.findByIdAndUpdate(id, 
                { 
                    comm_count_like: countLike,
                    $pull: { comm_liked_by: likeByUserId }
                }, 
                { new: true }
            );
        } else {
            countLike = Number(comment.comm_count_like) + 1;

            return this.commentModel.findByIdAndUpdate(id, 
                { 
                    comm_count_like: countLike,
                    $push: { comm_liked_by: likeByUserId }
                }, 
                { new: true }
            );
        }
    }

    async dislike(id: string, dislikeByUserId: string): Promise<Comment> {
        const dislikeByUser = await this.userModel.findById(dislikeByUserId); 

        if (!dislikeByUser) {
            throw new NotFoundException("User not found"); 
        }

        let countDislike = 0;
        const hasAlreadyLiked = await this.commentModel.findOne({ comm_disliked_by: dislikeByUserId });
        const comment = await this.findById(id);

        if (hasAlreadyLiked && hasAlreadyLiked.comm_count_dislike > 0) {
            countDislike = Number(comment.comm_count_dislike) - 1;

            return this.commentModel.findByIdAndUpdate(id, 
                { 
                    comm_count_dislike: countDislike,
                    $pull: { comm_disliked_by: dislikeByUserId }
                }, 
                { new: true }
            );
        } else {
            countDislike = Number(comment.comm_count_dislike) + 1;

            return this.commentModel.findByIdAndUpdate(id, 
                { 
                    comm_count_dislike: countDislike,
                    $push: { comm_disliked_by: dislikeByUserId }
                }, 
                { new: true }
            );
        }
    }
}
