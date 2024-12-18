import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, Max, Min, ValidateIf } from 'class-validator';
import { User } from 'src/modules/users/schemas/user.schema';
import { CommentEnum } from 'src/utils/enums/comment.enum';
import { Course } from '../../learning/schemas/course.schema';
import { IAddCommentDto } from 'src/interfaces/comments/IAddCommentDto';

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

  author: User;

  @ApiProperty({
    example: '6761b8ab3f368c5bd724e580 or null',
    description: 'Comment Id',
  })
  comment_id: string | null;

  @ApiProperty({
    example: '675fbc4b3563cd8894f79ce4',
    description: 'Course Id',
  })
  course: Course;
}
