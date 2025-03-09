import { ApiProperty } from '@nestjs/swagger';
import { SaveLessonDto } from './save-lesson.dto';

export class EditLesson extends SaveLessonDto {
  @ApiProperty({
    description: 'Lesson Video File',
    type: 'string',
    format: 'binary',
    required: false,
  })
  file: any;
}
