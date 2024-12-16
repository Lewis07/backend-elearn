import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { SaveLessonDto } from './save-lesson.dto';

export class AddLesson extends SaveLessonDto {
  @ApiProperty({
    example: '675efe82fe9bcfa3481d508c',
    description: 'Section Id',
  })
  @IsNotEmpty({ message: 'Section is required' })
  section_id: string;

  @ApiProperty({
    description: 'Lesson Video File',
    type: 'string',
    format: 'binary',
  })
  file: File;
}
