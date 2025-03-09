import { ApiProperty } from '@nestjs/swagger';
import { SaveCourseDto } from './save-course.dto';

export class CreateCourse extends SaveCourseDto {
  @ApiProperty({
    description: 'Course Photo',
    type: 'string',
    format: 'binary',
  })
  file: any;
  // file: File;

  author_id: string;
}
