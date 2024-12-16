import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Purchase } from 'src/purchases/schemas/purchase.schema';

@Injectable()
export class LearningService {
  constructor(
    @InjectModel(Purchase.name) private purchaseModel: Model<Purchase>,
  ) {}

  async getLearning(userId: string) {
    return await this.purchaseModel
      .findOne({
        'user.id': userId,
      })
      .select('purchaseItems -_id');
  }
}
