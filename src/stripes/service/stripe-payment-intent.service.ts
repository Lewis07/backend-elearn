import { Injectable } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { SaveStripePaymentIntentDto } from '../dto/save-stripe-payment-intent.dto';

@Injectable()
export class StripePaymentIntentService extends StripeService {
  async create() {
    return await this.stripe.paymentIntents.create({
      amount: 100,
      currency: 'eur',
      customer: 'cus_QG2KEcn1hiTNIG',
      metadata: {
        purchase_id: '6664c0f76c2c1be69fb7937b',
      },
    });
  }
}
