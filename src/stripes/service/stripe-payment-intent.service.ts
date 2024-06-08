import { Injectable } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { SaveStripePaymentIntentDto } from '../dto/save-stripe-payment-intent.dto';
import Stripe from 'stripe';

@Injectable()
export class StripePaymentIntentService extends StripeService {
  async create(saveStripePaymentIntentDto: SaveStripePaymentIntentDto) {
    const { amount, currency, customer, purchase_id } = saveStripePaymentIntentDto;

    const data: Stripe.PaymentIntentCreateParams = {
        amount: amount * 100,
        currency,
        customer,
        payment_method_types: ['card'],
        metadata: {
            purchase_id
        }
    };

    return await this.stripe.paymentIntents.create(data);
  }
}
