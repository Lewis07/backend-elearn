import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Course } from '../../learning/schemas/course.schema';
import { User } from '../../users/schemas/user.schema';
import mongoose from 'mongoose';
import { Lesson } from 'src/modules/learning/schemas/lessons/lesson.schema';
import { CommentEnum } from 'src/utils/enums/comment.enum';
import { AbstractDocument } from 'src/common/document/abstract.document';

@Schema({
  collection: 'comments',
})
export class Comment extends AbstractDocument {
  @Prop({ default: null })
  comm_rating: number;

  @Prop({ trim: true, required: true })
  comm_content: string;

  @Prop({ trim: true, required: true, enum: CommentEnum })
  comm_source: CommentEnum;

  @Prop({ type: mongoose.Schema.ObjectId, ref: 'User', required: true })
  author: User;

  @Prop({ type: mongoose.Schema.ObjectId, ref: 'Course', default: null })
  course: Course;

  @Prop({ type: mongoose.Schema.ObjectId, ref: 'Lesson', default: null })
  lesson: Lesson;

  @Prop({ type: mongoose.Schema.ObjectId, ref: 'Comment', default: null })
  parent_comment: Comment;

  @Prop({ type: [mongoose.Schema.ObjectId], ref: 'Comment' })
  replies: Comment[];

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
