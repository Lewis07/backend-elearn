import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Course } from '../../courses/schemas/course.schema';
import { User } from '../../users/schemas/user.schema';
import mongoose from 'mongoose';
import { Lesson } from 'src/lessons/schemas/lesson.schema';
import { CommentEnum } from 'src/utils/enum/comment-enum.utils';

@Schema({
  timestamps: true,
})
export class Comment {
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
  parentComment: Comment;

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

  createdAt: Date;
  updatedAt: Date;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
