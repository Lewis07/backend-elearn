import { AbstractRepository } from 'src/common/repository/abstract.repository';
import { StripePaymentIntent } from '../schemas/stripe-payment-intent.schema';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export class StripePaymentIntentRepository extends AbstractRepository<StripePaymentIntent> {
  protected logger: Logger = new Logger();

  constructor(
    @InjectModel(StripePaymentIntent.name)
    private stripePaymentIntent: Model<StripePaymentIntent>,
  ) {
    super(stripePaymentIntent);
  }
}
