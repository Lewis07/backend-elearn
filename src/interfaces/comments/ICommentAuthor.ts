import { Types } from 'mongoose';

export interface ICommentAuthor {
  _id: Types.ObjectId;
  usr_photo: string;
  usr_username: string;
  usr_firstname: string;
  usr_lastname: string;
}
