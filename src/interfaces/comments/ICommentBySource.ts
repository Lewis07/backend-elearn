import { Comment } from 'src/modules/comments/schemas/comment.schema';

export interface ICommentBySource {
  comments: Comment[];
  totalComment: number;
}
