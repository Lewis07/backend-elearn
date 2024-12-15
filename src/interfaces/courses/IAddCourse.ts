import { LevelEnum } from 'src/utils/enum/level-enum.utils';
import { IUser } from '../users/IUser';

export interface IAddCourse {
  crs_title: string;
  crs_slug: string;
  crs_description: string;
  crs_price: number;
  crs_new_price?: number;
  crs_isPaid: boolean;
  crs_photo?: string;
  level_id: LevelEnum;
  author: Omit<IUser, 'usr_password'>;
}
