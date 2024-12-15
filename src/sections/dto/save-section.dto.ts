import { IsNotEmpty } from 'class-validator';
import { Course } from '../../courses/schemas/course.schema';
import { ApiProperty } from '@nestjs/swagger';

export class SaveSection {
  @ApiProperty({ example: 'Introduction', description: 'Section Title' })
  @IsNotEmpty({ message: 'Title is required' })
  sect_title: string;

  @ApiProperty({
    example: '675ecd4eb57c772b733fecd5',
    description: 'Course Id',
  })
  @IsNotEmpty({ message: 'Course is required' })
  course: Course;
}
