import { ApiProperty } from '@nestjs/swagger';
import { SaveCourseDto } from './save-course.dto';

export class EditCourse extends SaveCourseDto {
  @ApiProperty({
    example: '25.8',
    description: 'Course New Price',
  })
  crs_new_price?: number;

  @ApiProperty({
    description: 'Course Photo',
    type: 'string',
    format: 'binary',
    required: false,
  })
  // file?: File;
  file?: any;
}
