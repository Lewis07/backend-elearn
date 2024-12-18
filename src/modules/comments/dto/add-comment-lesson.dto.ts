import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { IAddCommentDto } from 'src/interfaces/comments/IAddCommentDto';
import { Lesson } from 'src/modules/learning/schemas/lessons/lesson.schema';
import { User } from 'src/modules/users/schemas/user.schema';

export class AddCommentLesson implements IAddCommentDto {
  @ApiProperty({
    example: 'Best lesson, keep on',
    description: 'Comment Content',
  })
  @IsNotEmpty({ message: 'Content is required' })
  comm_content: string;

  author: User;

  @ApiProperty({
    example: '6761b8ab3f368c5bd724e580',
    description: 'Comment Id',
  })
  comment_id: string | null;

  @ApiProperty({
    example: '675fbd1100abc3bc3988b3b5',
    description: 'Lesson Id',
  })
  lesson: Lesson;
}
