import { User } from 'src/modules/users/schemas/user.schema';
import { ISaveCourse } from './ISaveCourse';

export interface IAddCourse extends ISaveCourse {
  author: User;
}
