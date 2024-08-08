import {
  IsNotEmpty,
  IsOptional,
  Min,
} from 'class-validator';
import { LevelEnum } from '../../utils/enum/level-enum.utils';
import { Transform } from 'class-transformer';

export class SaveCourseDto {
  @IsNotEmpty({ message: 'Title is required' })
  crs_title: string;

  @IsNotEmpty({ message: 'Description is required' })
  crs_description: string;

  @Transform(
    ({ value }) => {
      if (value === '' || value === null) {
        return null;
      } else {
        return Number(value);
      }
    },
    { toClassOnly: true },
  )
 
  @Min(0, { message: 'Price is required and must be a number with minimum value 0' })
  crs_price: number;

  @IsOptional()
  @Min(0, { message: 'Price is required and must be a number with minimum value 0' })
  crs_new_price?: number;

  crs_isPaid: boolean;

  crs_photo?: string;

  @IsNotEmpty()
  level_id: LevelEnum;
}
