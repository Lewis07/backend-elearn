import { Types } from 'mongoose';
import { ICourseSection } from '../sections/ICourseSection';

export interface ISectionLessons {
  _id: Types.ObjectId;
  course: ICourseSection;
}
