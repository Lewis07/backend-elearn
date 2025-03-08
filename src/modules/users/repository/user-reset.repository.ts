import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../../../common/repository/abstract.repository';
import { UserReset } from '../schemas/user-reset.schema';

@Injectable()
export class UserResetRepository extends AbstractRepository<UserReset> {
  protected readonly logger: Logger = new Logger(UserResetRepository.name);

  constructor(@InjectModel(UserReset.name) userResetModel: Model<UserReset>) {
    super(userResetModel);
  }
}
