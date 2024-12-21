import mongoose, { Schema as SchemaMongoose, Types } from 'mongoose';
import { ICommentAuthor } from 'src/interfaces/comments/ICommentAuthor';
import { ICommentCourse } from 'src/interfaces/comments/ICommentCourse';
import { ICommentLesson } from 'src/interfaces/comments/ICommentLesson';
import { CommentEnum } from 'src/utils/enums/comment.enum';

export const CommentReplies = new SchemaMongoose({
  _id: {
    type: Types.ObjectId,
  },
  comm_rating: {
    type: String,
  },
  comm_content: {
    type: String,
  },
  comm_source: {
    type: String,
    enum: Object.values(CommentEnum),
  },
  author: {
    type: Types.ObjectId,
    required: true,
    ref: 'User',
    validate: {
      validator: function (value: ICommentAuthor) {
        return value && value._id && value.usr_username;
      },
      message: 'Invalid author details',
    },
  },
  course: {
    type: Types.ObjectId,
    required: true,
    ref: 'Course',
    validate: {
      validator: function (value: ICommentCourse) {
        return value && value._id && value.crs_title;
      },
      message: 'Invalid author details',
    },
  },
  lesson: {
    type: Types.ObjectId,
    required: true,
    ref: 'Lesson',
    validate: {
      validator: function (value: ICommentLesson) {
        return value && value._id && value.lssn_title;
      },
      message: 'Invalid author details',
    },
  },
  comm_count_like: {
    type: Number,
  },
  comm_liked_by: {
    type: [mongoose.Schema.ObjectId],
  },
  comm_count_dislike: {
    type: Number,
  },
  comm_disliked_by: {
    type: [mongoose.Schema.ObjectId],
  },
});
