import { Types } from 'mongoose';
import { UserTypeEnum } from 'src/utils/enum/user-type-enum.utils';

export interface IUserUpdateProfile {
  _id: Types.ObjectId;
  usr_username: string;
  usr_email: string;
  usr_registered_date: Date;
  usr_type: UserTypeEnum;
  usr_firstname: string;
  usr_lastname: string;
}
