import { Injectable } from '@nestjs/common';
import { PurchaseRepository } from '../../../modules/purchases/repository/purchase.repository';

@Injectable()
export class LearningService {
  constructor(private purchaseRepository: PurchaseRepository) {}

  async getLearning(userId: string) {
    return await this.purchaseRepository.find({
      'user.id': userId,
    });
  }
}
