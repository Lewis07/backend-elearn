import mongoose, { Schema as SchemaMongoose, Types } from 'mongoose';
import { CommentEnum } from 'src/utils/enums/comment.enum';
import { CommentAuthor } from './comment-author.schema';
import { CommentCourse } from './comment-course.schema';
import { CommentLesson } from './comment-lesson.schema';

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
    type: CommentAuthor,
    required: true,
  },
  course: {
    type: CommentCourse,
    required: true,
  },
  lesson: {
    type: CommentLesson,
    required: true,
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
