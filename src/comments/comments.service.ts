import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './schemas/comment.schema';
import mongoose, { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { EditCommentDto } from './dto/edit-comment.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { CommentEnum } from 'src/utils/enum/comment-enum.utils';

type ReactionComment = 'like' | 'dislike';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<Comment>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async findAll() {
    return await this.commentModel
      .find({ parentComment: null })
      .populate({
        path: 'author',
        select: ['_id', 'usr_username', 'usr_firstname', 'usr_lastname'],
      })
      .populate({
        path: 'replies',
        populate: {
          path: 'author',
          select: ['_id', 'usr_username', 'usr_firstname', 'usr_lastname'],
        },
      })
      .sort({ createdAt: -1 });
  }

  async findByCourse(courseId: string) {
    const comments = await this.findByCommentSource(
      String(CommentEnum.COURSE),
      courseId,
      false,
    );

    const commentsWithReplies = await this.findByCommentSource(
      String(CommentEnum.COURSE),
      courseId,
      true,
    );

    return {
      comments,
      totalComment: commentsWithReplies.length,
    };
  }

  async findByLesson(lessonId: string) {
    const comments = await this.findByCommentSource(
      String(CommentEnum.LESSON),
      lessonId,
      true,
    );

    const commentsWithReplies = await this.findByCommentSource(
      String(CommentEnum.LESSON),
      lessonId,
      false,
    );

    return {
      comments,
      totalComment: commentsWithReplies.length,
    };
  }

  async findByCommentSource(source: string, id: string, withReplies: boolean) {
    let filterCommentByLesson: any = {
      ...(Number(source) === Number(CommentEnum.COURSE)
      ? { course: id }
      : { lesson: id })
    }

    if (withReplies) {
      filterCommentByLesson.parentComment = null;
    }

    const comments = await this.commentModel
      .find(filterCommentByLesson)
      .populate({
        path: 'author',
        select: ['_id', 'usr_username', 'usr_firstname', 'usr_lastname'],
      })
      .populate({
        path: 'replies',
        options: {
          sort: { createdAt: -1 },
        },
        populate: {
          path: 'author',
          select: ['_id', 'usr_username', 'usr_firstname', 'usr_lastname'],
        },
      })
      .sort({ createdAt: -1 });

    return comments;
  }

  async findById(id: string) {
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

  async store(authorId: string, addCommentDto: AddCommentDto) {
    let parent = null;
    let commentId = addCommentDto.comment_id;

    if (null !== commentId) {
      parent = await this.findById(String(commentId));
    }

    let data = {
      ...addCommentDto,
      author: authorId,
      comm_count_like: 0,
      comm_liked_by: [],
      comm_count_dislike: 0,
      comm_disliked_by: [],
      ...(parent ? { parentComment: parent._id } : { parentComment: null }),
    };

    let comment = await this.commentModel.create(data);

    let commentCreated = await comment.populate({
      path: 'author',
      select: ['_id', 'usr_username', 'usr_firstname', 'usr_lastname'],
    });

    if (parent) {
      await this.commentModel.findByIdAndUpdate(parent._id, {
        $push: {
          replies: commentCreated,
        },
      });

      let replyComment = await this.commentModel
        .findById(parent._id)
        .populate({
          path: 'author',
          select: ['_id', 'usr_username', 'usr_firstname', 'usr_lastname'],
        })
        .populate({
          path: 'replies',
          populate: {
            path: 'author',
            select: ['_id', 'usr_username', 'usr_firstname', 'usr_lastname'],
          },
        });

      return replyComment;
    }

    return commentCreated;
  }

  async update(id: string, editCommentDto: EditCommentDto): Promise<Comment> {
    await this.findById(id);

    return this.commentModel.findByIdAndUpdate(id, editCommentDto, {
      new: true,
    });
  }

  async delete(id: string) {
    await this.findById(id);

    const comments = await this.commentModel
      .find({ parentComment: id })
      .select('_id');

    if (comments.length > 0) {
      const commentsId = comments.map((comment) => comment._id.toString());
      await this.commentModel.deleteMany({
        _id: {
          $in: commentsId,
        },
      });
    }

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
}
