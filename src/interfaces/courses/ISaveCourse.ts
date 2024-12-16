import { LevelEnum } from 'src/utils/enums/level.enum';

export interface ISaveCourse {
  crs_title: string;
  crs_slug?: string;
  crs_description: string;
  crs_price: number;
  crs_isPaid: boolean;
  level_id: LevelEnum;
  crs_photo?: string;
}
