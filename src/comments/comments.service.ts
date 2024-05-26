import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './schemas/comment.schema';
import mongoose, { Model } from 'mongoose';
import { AddCommentDto } from './dto/add-comment.dto';
import { EditCommentDto } from './dto/edit-comment.dto';
import { User } from '../users/schemas/user.schema';

type ReactionComment = 'like' | 'dislike';

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
        return this.handleLikeDislike(id, likeByUserId, "like");
    }

    async dislike(id: string, dislikeByUserId: string): Promise<Comment> {
        return this.handleLikeDislike(id, dislikeByUserId, "dislike");
    }

    async handleLikeDislike(id: string, userId: string, reaction: ReactionComment) {
        const user = await this.userModel.findById(userId); 

        if (!user) {
            throw new NotFoundException("User not found"); 
        }

        let countReactionLikeOrDislike = 0;
        let fieldCount = reaction === 'like' ? "comm_count_like" : "comm_count_dislike"; 
        let fieldReactor = reaction === 'like' ? "comm_liked_by" : "comm_disliked_by";

        const hasAlreadyReacted = await this.commentModel.findOne({ [fieldReactor]: userId });
        const comment = await this.findById(id);

        if (hasAlreadyReacted && hasAlreadyReacted[fieldCount] > 0) {
            countReactionLikeOrDislike = Number(comment[fieldCount]) - 1;

            return this.commentModel.findByIdAndUpdate(id, 
                { 
                    [fieldCount]: countReactionLikeOrDislike,
                    $pull: { [fieldReactor]: userId }
                }, 
                { new: true }
            );   
        } else {
            countReactionLikeOrDislike = Number(comment[fieldCount]) + 1;

            return this.commentModel.findByIdAndUpdate(id, 
                { 
                    [fieldCount]: countReactionLikeOrDislike,
                    $push: { [fieldReactor]: userId }
                }, 
                { new: true }
            );
        }
    }
}
