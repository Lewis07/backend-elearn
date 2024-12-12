import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, Max, Min, ValidateIf } from 'class-validator';
import { Lesson } from 'src/lessons/schemas/lesson.schema';
import { User } from 'src/users/schemas/user.schema';
import { CommentEnum } from 'src/utils/enum/comment-enum.utils';
import { Course } from '../../courses/schemas/course.schema';

export class AddCommentDto {
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

  @IsNotEmpty({ message: 'Source of comment is required' })
  @IsEnum(CommentEnum, { message: 'The source is either course or lesson' })
  comm_source: string;

  author: User;
  comment_id: string | null;

  course: Course;
  lesson: Lesson;
}
