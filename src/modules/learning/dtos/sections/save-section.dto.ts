import { IsNotEmpty } from 'class-validator';
import { Course } from '../../schemas/course.schema';
import { ApiProperty } from '@nestjs/swagger';

export class SaveSection {
  @ApiProperty({ example: 'Introduction', description: 'Section Title' })
  @IsNotEmpty({ message: 'Title is required' })
  sect_title: string;
}
