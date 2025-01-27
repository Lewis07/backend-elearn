import { Types } from 'mongoose';

export interface IUserInTeacher {
  _id: Types.ObjectId;
  usr_username: string;
  usr_firstname?: string;
  usr_lastname?: string;
  usr_photo?: string;
}
