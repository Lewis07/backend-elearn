import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AbstractRepository } from '../../../common/repository/abstract.repository';
import { StripeCustomer } from '../../../modules/payment/schemas/stripe-customer.schema';

@Injectable()
export class StripeCustomerRepository extends AbstractRepository<StripeCustomer> {
  protected logger: Logger;

  constructor(
    @InjectModel(StripeCustomer.name)
    stripeCustomerModel: Model<StripeCustomer>,
  ) {
    super(stripeCustomerModel);
  }
}
