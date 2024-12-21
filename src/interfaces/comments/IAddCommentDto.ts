import { Types } from 'mongoose';

export interface IAddCommentDto {
  comment_id: Types.ObjectId | null;
  course_id?: Types.ObjectId;
  lesson_id?: Types.ObjectId;
}
