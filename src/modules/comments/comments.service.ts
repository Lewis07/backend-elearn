import { ForbiddenException, Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { IAddComment } from 'src/interfaces/comments/IAddComment';
import { ICommentBySource } from 'src/interfaces/comments/ICommentBySource';
import { IReactionTypeAndReacter } from 'src/interfaces/comments/IReactionTypeAndReacter';
import { CommentEnum } from 'src/utils/enums/comment.enum';
import { UserRepository } from '../users/repository/user.repository';
import { User } from '../users/schemas/user.schema';
import { AddCommentCourse } from './dto/add-comment-course.dto';
import { AddCommentLesson } from './dto/add-comment-lesson.dto';
import { EditCommentCourse } from './dto/edit-comment-course.dto';
import { EditCommentLesson } from './dto/edit-comment-lesson.dto';
import { CommentRepository } from './repository/comment.repository';
import { Comment } from './schemas/comment.schema';
import { ReactionComment } from './types/TReactionComment';
import { Course } from '../learning/schemas/course.schema';
import { CourseRepository } from '../learning/repositories/course.repository';
import { IAddCommentDto } from 'src/interfaces/comments/IAddCommentDto';
import { LessonRepository } from '../learning/repositories/lesson.repository';
import { Lesson } from '../learning/schemas/lessons/lesson.schema';
import { ICommentReplies } from 'src/interfaces/comments/ICommentReplies';

@Injectable()
export class CommentsService {
  constructor(
    private commentRepository: CommentRepository,
    private userRepository: UserRepository,
    private courseRepository: CourseRepository,
    private lessonRepository: LessonRepository,
  ) {}

  async findById(id: string): Promise<Comment> {
    return await this.commentRepository.findById(new Types.ObjectId(id));
  }

  async findByCourse(courseId: string): Promise<ICommentBySource> {
    const comments: Comment[] = await this.findByCommentSource(
      String(CommentEnum.COURSE),
      courseId,
      false,
    );

    const commentsWithReplies: Comment[] = await this.findByCommentSource(
      String(CommentEnum.COURSE),
      courseId,
      true,
    );

    return {
      comments,
      totalComment: commentsWithReplies.length,
    };
  }

  async findByLesson(lessonId: string): Promise<ICommentBySource> {
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

  async findByCommentSource(
    source: string,
    id: string,
    withReplies: boolean,
  ): Promise<Comment[]> {
    let filterCommentByLesson: any = {
      ...(Number(source) === Number(CommentEnum.COURSE)
        ? { 'course._id': id }
        : { 'lesson._id': id }),
    };

    if (withReplies) {
      filterCommentByLesson.parentComment = null;
    }

    const comments = await this.commentRepository.find(filterCommentByLesson);

    return comments;
  }

  async store(
    authorId: string,
    commentDto: IAddCommentDto,
    source: CommentEnum,
  ): Promise<Comment> {
    let parentComment: Comment = null;
    let commentId: Types.ObjectId = commentDto.comment_id;
    let course: Course = null;
    let lesson: Lesson = null;

    if (null !== commentId) {
      parentComment = await this.findById(String(commentId));
    }

    const author: User = await this.userRepository.findById(
      new Types.ObjectId(authorId),
    );

    if (source == CommentEnum.LESSON) {
      lesson = await this.lessonRepository.findById(
        new Types.ObjectId(commentDto.lesson_id),
      );
    }

    if (source == CommentEnum.COURSE) {
      course = await this.courseRepository.findById(
        new Types.ObjectId(commentDto.course_id),
      );
    }

    let data: any = {
      ...commentDto,
      author: {
        _id: author._id,
        usr_photo: author.usr_photo ?? null,
        usr_username: author.usr_username,
        usr_firstname: author.usr_firstname ?? null,
        usr_lastname: author.usr_lastname ?? null,
      },
      comm_source: source,
      course:
        source == CommentEnum.COURSE
          ? {
              _id: course._id,
              crs_title: course.crs_title,
            }
          : null,
      lesson:
        source == CommentEnum.LESSON
          ? {
              _id: lesson._id,
              lssn_title: lesson.lssn_title,
            }
          : null,
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
      const commentSaved: Comment = await this.commentRepository.findById(
        comment._id,
      );

      const commentDetailed: ICommentReplies = {
        _id: commentSaved._id,
        comm_content: commentSaved.comm_content,
        comm_source: commentSaved.comm_source,
        author: {
          _id: commentSaved._id,
          usr_photo: commentSaved.author.usr_photo,
          usr_username: commentSaved.author.usr_username,
          usr_firstname: commentSaved.author.usr_firstname,
          usr_lastname: commentSaved.author.usr_lastname,
        },
        course: commentSaved.course,
        lesson: commentSaved.lesson,
        comm_count_like: commentSaved.comm_count_like,
        comm_liked_by: commentSaved.comm_liked_by,
        comm_count_dislike: commentSaved.comm_count_dislike,
        comm_disliked_by: commentSaved.comm_disliked_by,
      };

      await this.commentRepository.findByIdAndUpdate(parentComment._id, {
        $push: {
          replies: commentDetailed,
        },
      });

      return parentComment;
    } else {
      return comment;
    }
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
