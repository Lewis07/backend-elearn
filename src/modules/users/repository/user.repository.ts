import { AbstractRepository } from '../../../common/repository/abstract.repository';
import { User } from '../schemas/user.schema';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository extends AbstractRepository<User> {
  protected readonly logger: Logger = new Logger(UserRepository.name);

  constructor(@InjectModel(User.name) userModel: Model<User>) {
    super(userModel);
  }
}
