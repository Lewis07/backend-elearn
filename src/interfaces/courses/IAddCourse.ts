import { User } from 'src/users/schemas/user.schema';
import { ISaveCourse } from './ISaveCourse';

export interface IAddCourse extends ISaveCourse {
  author: User;
}
