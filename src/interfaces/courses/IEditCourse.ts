import { ISaveCourse } from './ISaveCourse';

export interface IEditCourse extends ISaveCourse {
  crs_new_price?: number;
}
