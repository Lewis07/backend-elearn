import { LevelEnum } from 'src/utils/enums/level.enum';
import { IUser } from '../users/IUser';

export interface ICourse {
  crs_title: string;
  crs_slug: string;
  crs_description: string;
  crs_price: number;
  crs_new_price: number;
  crs_isPaid: boolean;
  crs_photo: string;
  createdAt: Date;
  updatedAt: Date;
  author: IUser;
  level_id: LevelEnum;
}
