import { Types } from 'mongoose';
import { ICourseSections } from '../sections/ICourseSections';

export interface ISectionLessons {
  _id: Types.ObjectId;
  course: ICourseSections;
}
