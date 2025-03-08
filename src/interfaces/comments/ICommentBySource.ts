import { Comment } from '../../modules/comments/schemas/comment.schema';

export interface ICommentBySource {
  comments: Comment[];
  totalComment: number;
}
