import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from 'src/core/repository/abstract.repository';
import { Purchase } from '../schemas/purchase.schema';

export class PurchaseRepository extends AbstractRepository<Purchase> {
  protected logger: Logger = new Logger();

  constructor(
    @InjectModel(Purchase.name) private purchaseModel: Model<Purchase>,
  ) {
    super(purchaseModel);
  }
}
