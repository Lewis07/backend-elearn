import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';
import { IAddCommentDto } from '../../../interfaces/comments/IAddCommentDto';

export class AddCommentLesson implements IAddCommentDto {
  @ApiProperty({
    example: 'Best lesson, keep on',
    description: 'Comment Content',
  })
  @IsNotEmpty({ message: 'Content is required' })
  comm_content: string;

  @ApiProperty({
    example: '6761b8ab3f368c5bd724e580',
    description: 'Comment Id',
  })
  comment_id: Types.ObjectId | null;

  @ApiProperty({
    example: '675fbd1100abc3bc3988b3b5',
    description: 'Lesson Id',
  })
  lesson_id: Types.ObjectId;
}
