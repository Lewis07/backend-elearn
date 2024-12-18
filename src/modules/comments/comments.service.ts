import { ForbiddenException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { IReactionTypeAndReacter } from 'src/interfaces/comments/IReactionTypeAndReacter';
import { CommentEnum } from 'src/utils/enums/comment.enum';
import { UserRepository } from '../users/repository/user.repository';
import { AddCommentCourse } from './dto/add-comment-course.dto';
import { AddCommentLesson } from './dto/add-comment-lesson.dto';
import { EditCommentCourse } from './dto/edit-comment-course.dto';
import { EditCommentLesson } from './dto/edit-comment-lesson.dto';
import { CommentRepository } from './repository/comment.repository';
import { Comment } from './schemas/comment.schema';
import { ReactionComment } from './types/TReactionComment';
import { User } from '../users/schemas/user.schema';
import { IAddComment } from 'src/interfaces/comments/IAddComment';

@Injectable()
export class CommentsService {
  constructor(
    private commentRepository: CommentRepository,
    private userRepository: UserRepository,
  ) {}

  async findAll(): Promise<Comment[]> {
    return this.commentRepository.find({ parentComment: null });
  }

  async findById(id: string): Promise<Comment> {
    return await this.commentRepository.findById(new Types.ObjectId(id));
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
        : { lesson: id }),
    };

    if (withReplies) {
      filterCommentByLesson.parentComment = null;
    }

    const comments = await this.commentRepository.find(filterCommentByLesson);
    // .populate({
    //   path: 'author',
    //   select: ['_id', 'usr_username', 'usr_firstname', 'usr_lastname'],
    // })
    // .populate({
    //   path: 'replies',
    //   options: {
    //     sort: { createdAt: -1 },
    //   },
    //   populate: {
    //     path: 'author',
    //     select: ['_id', 'usr_username', 'usr_firstname', 'usr_lastname'],
    //   },
    // })
    // .sort({ createdAt: -1 });

    return comments;
  }

  async store(
    authorId: string,
    commentDto: AddCommentCourse | AddCommentLesson,
    source: CommentEnum,
  ): Promise<Comment> {
    let parentComment: Comment = null;
    let commentId: string = commentDto.comment_id;

    if (null !== commentId) {
      parentComment = await this.findById(String(commentId));
    }

    const author: User = await this.userRepository.findById(
      new Types.ObjectId(authorId),
    );

    let data: IAddComment = {
      ...commentDto,
      author,
      comm_source: source,
      comm_count_like: 0,
      comm_liked_by: [],
      comm_count_dislike: 0,
      comm_disliked_by: [],
      ...(parentComment
        ? { parent_comment: parentComment._id }
        : { parent_comment: null }),
    };

    let comment: Comment = await this.commentRepository.create(data);

    if (parentComment) {
      await this.commentRepository.findByIdAndUpdate(parentComment._id, {
        $push: {
          replies: comment,
        },
      });

      let replyComment = await this.commentRepository.findById(
        parentComment._id,
      );
      // .populate({
      //   path: 'author',
      //   select: ['_id', 'usr_username', 'usr_firstname', 'usr_lastname'],
      // })
      // .populate({
      //   path: 'replies',
      //   populate: {
      //     path: 'author',
      //     select: ['_id', 'usr_username', 'usr_firstname', 'usr_lastname'],
      //   },
      // });

      return replyComment;
    }

    return comment;
  }

  async update(
    id: string,
    editCommentDto: EditCommentCourse | EditCommentLesson,
  ): Promise<Comment> {
    await this.findById(id);

    return this.commentRepository.findByIdAndUpdate(
      new Types.ObjectId(id),
      editCommentDto,
    );
  }

  async delete(id: string, authorId: string): Promise<void> {
    const comment: Comment = await this.findById(id);

    if (String(comment.author) !== authorId) {
      throw new ForbiddenException(
        "You can't remove a comment who don't belong to you",
      );
    }

    const comments: Comment[] = await this.commentRepository.find({
      parentComment: id,
    });

    if (comments.length > 0) {
      const commentsId: Types.ObjectId[] = comments.map(
        (comment) => comment._id,
      );
      await this.commentRepository.deleteMany({
        _id: {
          $in: commentsId,
        },
      });
    }

    return this.commentRepository.findByIdAndDelete(new Types.ObjectId(id));
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
    reactionType: ReactionComment,
  ): Promise<Comment> {
    await this.userRepository.findById(new Types.ObjectId(userId));

    const comment: Comment = await this.findById(id);
    const reactionTypeAndReacter: IReactionTypeAndReacter = {
      like: { count: 'comm_count_like', users: 'comm_liked_by' },
      dislike: { count: 'comm_count_dislike', users: 'comm_disliked_by' },
    };

    const currentReaction = reactionTypeAndReacter[reactionType];
    const hasReacted = comment[currentReaction.users].includes(userId);

    const updateReactionAndReacter: any = {
      [currentReaction.count]: hasReacted
        ? comment[currentReaction.count] - 1
        : comment[currentReaction.count] + 1,
    };

    if (hasReacted) {
      updateReactionAndReacter.$pull = { [currentReaction.users]: userId };
    } else {
      updateReactionAndReacter.$push = { [currentReaction.users]: userId };
    }

    const oppositeReaction =
      reactionTypeAndReacter[reactionType === 'like' ? 'dislike' : 'like'];
    const hasOppositeReacted = comment[oppositeReaction.users].includes(userId);

    if (hasOppositeReacted) {
      updateReactionAndReacter[oppositeReaction.count] =
        comment[oppositeReaction.count] - 1;
      updateReactionAndReacter.$pull = {
        ...updateReactionAndReacter.$pull,
        [oppositeReaction.users]: userId,
      };
    }

    return await this.commentRepository.findByIdAndUpdate(
      new Types.ObjectId(id),
      updateReactionAndReacter,
    );
  }
}
