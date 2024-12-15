import { ApiProperty } from '@nestjs/swagger';
import { SaveSection } from './save-section.dto';
import { Course } from 'src/courses/schemas/course.schema';
import { IsNotEmpty } from 'class-validator';

export class CreateSection extends SaveSection {
  @ApiProperty({
    example: '675ecd4eb57c772b733fecd5',
    description: 'Course Id',
  })
  @IsNotEmpty({ message: 'Course is required' })
  courseId: Course;
}
