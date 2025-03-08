import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, Max, Min, ValidateIf } from 'class-validator';
import { Types } from 'mongoose';
import { IAddCommentDto } from '../../../interfaces/comments/IAddCommentDto';
import { CommentEnum } from '../../../utils/enums/comment.enum';

export class AddCommentCourse implements IAddCommentDto {
  @ApiProperty({ example: 4, description: 'Comment Rating' })
  @Transform(
    ({ value }) => {
      if (value === '' || value === null) {
        return null;
      } else {
        return Number(value);
      }
    },
    { toClassOnly: true },
  )
  @ValidateIf((comment) => comment.comm_source === CommentEnum.COURSE)
  @Max(5, { message: 'The maximum of rating is 5' })
  @Min(0, { message: 'The minimum of rating is 0' })
  @IsNotEmpty({ message: 'Rating is required' })
  comm_rating: number;

  @ApiProperty({
    example: "The course i've searched",
    description: 'Comment Content',
  })
  @IsNotEmpty({ message: 'Content is required' })
  comm_content: string;

  @ApiProperty({
    example: null,
    description:
      'Comment Id<br /> if there is parent , ex: 676728c1cd6b56b41c8f1b55',
  })
  comment_id: Types.ObjectId | null;

  @ApiProperty({
    example: '675fbc4b3563cd8894f79ce4',
    description: 'Course Id',
  })
  course_id: Types.ObjectId;
}
