import { Types } from 'mongoose';
import { UserTypeEnum } from 'src/utils/enums/user-type.enum';

export interface IUserUpdateProfile {
  _id: Types.ObjectId;
  usr_username: string;
  usr_email: string;
  usr_registered_date: Date;
  usr_type: UserTypeEnum;
  usr_firstname: string;
  usr_lastname: string;
}
