import { Comment } from 'src/modules/comments/schemas/comment.schema';
import { Course } from 'src/modules/learning/schemas/course.schema';
import { Lesson } from 'src/modules/learning/schemas/lessons/lesson.schema';
import { User } from 'src/modules/users/schemas/user.schema';
import { CommentEnum } from 'src/utils/enums/comment.enum';
import { ICommentAuthor } from './ICommentAuthor';

export interface IAddComment {
  comm_rating?: number;
  comm_content: string;
  comm_source: CommentEnum;
  author: ICommentAuthor;
  course?: Course;
  lesson?: Lesson;
  parent_comment: Comment;
  comm_count_like: number;
  comm_count_dislike: number;
  comm_liked_by: User[];
  comm_disliked_by: User[];
}
