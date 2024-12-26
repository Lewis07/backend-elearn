import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { AbstractDocument } from 'src/common/document/abstract.document';
import { ICommentAuthor } from 'src/interfaces/comments/ICommentAuthor';
import { ICommentCourse } from 'src/interfaces/comments/ICommentCourse';
import { ICommentLesson } from 'src/interfaces/comments/ICommentLesson';
import { CommentEnum } from 'src/utils/enums/comment.enum';
import { User } from '../../users/schemas/user.schema';
import { CommentAuthor } from './comment-author.schema';
import { CommentCourse } from './comment-course.schema';
import { CommentLesson } from './comment-lesson.schema';
import { CommentReplies } from './comment-replies.schema';
import { ICommentReplies } from 'src/interfaces/comments/ICommentReplies';

@Schema({
  collection: 'comments',
})
export class Comment extends AbstractDocument {
  @Prop({ default: null })
  comm_rating?: number;

  @Prop({ trim: true, required: true })
  comm_content: string;

  @Prop({ trim: true, required: true, enum: CommentEnum })
  comm_source: CommentEnum;

  @Prop({ type: CommentAuthor })
  author: ICommentAuthor;

  @Prop({ type: CommentCourse })
  course: ICommentCourse;

  @Prop({ type: CommentLesson })
  lesson: ICommentLesson;

  @Prop({ type: Types.ObjectId, ref: 'Comment', default: null })
  parent_comment: Types.ObjectId;

  @Prop({ type: [CommentReplies] })
  replies: [ICommentReplies];

  @Prop({ default: 0 })
  comm_count_like: number;

  @Prop({ type: [mongoose.Schema.ObjectId], ref: 'User' })
  comm_liked_by: User[];

  @Prop({ default: 0 })
  comm_count_dislike: number;

  @Prop({ type: [mongoose.Schema.ObjectId], ref: 'User' })
  comm_disliked_by: User[];
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
