import { IUser } from '../users/IUser';
import { ISaveCourse } from './ISaveCourse';

export interface IAddCourse extends ISaveCourse {
  author: Omit<IUser, 'usr_password'>;
}
