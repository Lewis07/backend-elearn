import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SaveLessonDto {
  @ApiProperty({
    example: 'lesson 1',
    description: 'Lesson 1',
  })
  @IsNotEmpty({ message: 'Title is required' })
  lssn_title: string;

  lssn_video_link: string;
  lssn_video_photo: string;
}
