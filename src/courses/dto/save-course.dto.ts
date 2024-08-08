import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  Min,
} from 'class-validator';
import { LevelEnum } from '../../utils/enum/level-enum.utils';

export class SaveCourseDto {
  @IsNotEmpty({ message: 'Title is required' })
  crs_title: string;

  @IsNotEmpty({ message: 'Description is required' })
  crs_description: string;

//   @IsNotEmpty({ message: 'Price is required' })
//   @IsNumber({}, { message: "Price must be a number" })
//   @Min(0, { message: "Price should not be negative" })
  crs_price: number;

  @IsOptional()
  @IsPositive({ message: 'Price should be greater than zero' })
  crs_new_price?: number;

  crs_isPaid: boolean;

  crs_photo?: string;

  @IsNotEmpty()
  level_id: LevelEnum;
}
