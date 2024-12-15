import { AbstractRepository } from 'src/core/repository/abstract.repository';
import { Comment } from '../schemas/comment.schema';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class CommentRepository extends AbstractRepository<Comment> {
  protected logger: Logger = new Logger();

  constructor(@InjectModel(Comment.name) private commentModel: Model<Comment>) {
    super(commentModel);
  }
}
