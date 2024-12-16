import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, Min } from 'class-validator';
import { LevelEnum } from '../../../utils/enum/level-enum.utils';
import { uppercaseFirstLetter } from 'src/utils/uppercaseFirstLetter';

const levels = Object.entries(LevelEnum).slice(
  0,
  Object.entries(LevelEnum).length / 2,
);

const levelsIdAndlevelsName = levels
  .map(([levelId, levelName]) => {
    return `${levelId} => ${uppercaseFirstLetter(levelName as string)}<br />`;
  })
  .join(' ');

export class SaveCourseDto {
  @ApiProperty({ example: 'Javascript for pro', description: 'Course Title' })
  @IsOptional()
  @IsNotEmpty({ message: 'Title is required' })
  crs_title: string;

  @ApiProperty({
    example: 'Description of Javascript for pro',
    description: 'Course Description',
  })
  @IsOptional()
  @IsNotEmpty({ message: 'Description is required' })
  crs_description: string;

  @ApiProperty({
    example: '25.8',
    description: 'Course Price',
  })
  @IsOptional()
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
  @Min(0, {
    message: 'Price is required and must be a number with minimum value 0',
  })
  crs_price: number;

  @ApiProperty({
    default: false,
    description: 'Course Status',
  })
  crs_isPaid: boolean;

  crs_photo?: string;

  @ApiProperty({
    enum: LevelEnum,
    default: LevelEnum.BEGINNER,
    description: `Course Level <br /> ${levelsIdAndlevelsName}`,
  })
  @IsOptional()
  @IsNotEmpty()
  level_id: LevelEnum;
}
