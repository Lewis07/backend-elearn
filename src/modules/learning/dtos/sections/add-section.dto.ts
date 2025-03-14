import { ApiProperty } from '@nestjs/swagger';
import { SaveSection } from './save-section.dto';
import { Course } from '../../../../modules/learning/schemas/course.schema';
import { IsNotEmpty } from 'class-validator';

export class AddSection extends SaveSection {
  @ApiProperty({
    example: '675ecd4eb57c772b733fecd5',
    description: 'Course Id',
  })
  @IsNotEmpty({ message: 'Course is required' })
  course_id: Course;
}
