import mongoose, { Types } from 'mongoose';
import { CommentEnum } from 'src/utils/enums/comment.enum';
import { ICommentAuthor } from './ICommentAuthor';
import { ICommentCourse } from './ICommentCourse';
import { ICommentLesson } from './ICommentLesson';
import { User } from 'src/modules/users/schemas/user.schema';

export interface ICommentReplies {
  _id: Types.ObjectId;
  comm_rating?: string;
  comm_content: string;
  comm_source: CommentEnum;
  author: ICommentAuthor;
  course: ICommentCourse;
  lesson: ICommentLesson;
  comm_count_like: number;
  comm_liked_by: User[];
  comm_count_dislike: number;
  comm_disliked_by: User[];
}
