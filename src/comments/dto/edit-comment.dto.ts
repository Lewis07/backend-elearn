import { Transform } from 'class-transformer';
import { IsNotEmpty, Max, Min, ValidateIf } from 'class-validator';
import { CommentEnum } from 'src/utils/enum/comment-enum.utils';

export class EditCommentDto {
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

  @IsNotEmpty({ message: 'Content is required' })
  comm_content: string;
}
