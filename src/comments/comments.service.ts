import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './schemas/comment.schema';
import mongoose, { Model } from 'mongoose';
import { AddCommentDto } from './dto/add-comment.dto';
import { EditCommentDto } from './dto/edit-comment.dto';
import { User } from '../users/schemas/user.schema';

type ReactionComment = 'like' | 'dislike';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findAll() {
    return await this.commentModel.find().sort({ createdAt: -1 });
  }

  async findById(id: string): Promise<Comment> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Wrong mongoose id, please enter valid id');
    }

    const comment = await this.commentModel.findById(id);

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }

  async store(
    authorId: string,
    addCommentDto: AddCommentDto,
  ): Promise<Comment> {
    let data = {
      ...addCommentDto,
      author: authorId,
      comm_count_like: 0,
      comm_liked_by: [],
      comm_count_dislike: 0,
      comm_disliked_by: [],
    };

    return this.commentModel.create(data);
  }

  async update(id: string, editCommentDto: EditCommentDto): Promise<Comment> {
    await this.findById(id);

    return this.commentModel.findByIdAndUpdate(id, editCommentDto, {
      new: true,
    });
  }

  async delete(id: string): Promise<Comment> {
    await this.findById(id);

    return this.commentModel.findByIdAndDelete(id);
  }

  async like(id: string, likeByUserId: string): Promise<Comment> {
    return this.handleLikeDislike(id, likeByUserId, 'like');
  }

  async dislike(id: string, dislikeByUserId: string): Promise<Comment> {
    return this.handleLikeDislike(id, dislikeByUserId, 'dislike');
  }

  async handleLikeDislike(
    id: string,
    userId: string,
    reaction: ReactionComment,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) throw new NotFoundException('User not found');

    const comment = await this.findById(id);
    if (!comment) throw new NotFoundException('Comment not found');

    const reactionFields = {
      like: { count: 'comm_count_like', users: 'comm_liked_by' },
      dislike: { count: 'comm_count_dislike', users: 'comm_disliked_by' },
    };

    const currentField = reactionFields[reaction];
    const hasReacted = comment[currentField.users].includes(userId);

    const update: any = {
      [currentField.count]: hasReacted
        ? comment[currentField.count] - 1
        : comment[currentField.count] + 1,
    };

    if (hasReacted) {
      update.$pull = { [currentField.users]: userId };
    } else {
      update.$push = { [currentField.users]: userId };
    }

    const oppositeField =
      reactionFields[reaction === 'like' ? 'dislike' : 'like'];
    const hasOppositeReacted = comment[oppositeField.users].includes(userId);

    if (hasOppositeReacted) {
      update[oppositeField.count] = comment[oppositeField.count] - 1;
      update.$pull = { ...update.$pull, [oppositeField.users]: userId };
    }

    return await this.commentModel.findByIdAndUpdate(id, update, { new: true });
  }

  async findBycourse(courseId: string) {
    const comments = await this.commentModel
      .find({ course: courseId })
      .sort({ createdAt: -1 });

    let data = [];

    await Promise.all(
      comments.map(async (comment) => {
        const user = await this.userModel
          .findById(String(comment.author))
          .select('usr_username');

        data.push({
          comm_rating: comment.comm_rating,
          comm_content: comment.comm_content,
          author: user.usr_username,
          created_at: comment.createdAt,
        });
      }),
    );

    return {
      comments: data,
      totalComment: data.length
    };
  }
}
