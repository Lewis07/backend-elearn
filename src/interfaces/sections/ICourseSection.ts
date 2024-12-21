import { Types } from 'mongoose';

export interface ICourseSection {
  _id: Types.ObjectId;
  author: Types.ObjectId;
}
