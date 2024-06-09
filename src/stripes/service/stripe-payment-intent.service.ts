import { Injectable } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { SaveStripePaymentIntentDto } from '../dto/save-stripe-payment-intent.dto';
import Stripe from 'stripe';
import { InjectModel } from '@nestjs/mongoose';
import { StripePaymentIntent } from '../schemas/stripe-payment-intent.schema';
import { Model } from 'mongoose';

@Injectable()
export class StripePaymentIntentService extends StripeService {
  constructor(@InjectModel(StripePaymentIntent.name) private stripePaymentIntentModel: Model<StripePaymentIntent> ) {
    super();
  }

  async create(saveStripePaymentIntentDto: SaveStripePaymentIntentDto) {
    const { amount, currency, customer_id, purchase_id } = saveStripePaymentIntentDto;

    const dataPaymentIntent: Stripe.PaymentIntentCreateParams = {
      amount: amount * 100,
      currency,
      customer: customer_id,
      payment_method_types: ['card'],
      metadata: {
        purchase_id,
      },
    };

    try {
      const paymentIntent = await this.stripe.paymentIntents.create(dataPaymentIntent);
      const confirmPaymentIntent = await this.stripe.paymentIntents.confirm(
        paymentIntent.id,
        {
          payment_method: 'pm_card_visa',
          return_url: process.env.FRONTEND_URL,
        },
      );

      const paymentMethodId = confirmPaymentIntent.payment_method as string;

      if (!paymentMethodId) {
        throw new Error('Payment method ID is undefined');
      }

      return this.saveStripePaymentIntent(paymentMethodId, confirmPaymentIntent, customer_id, purchase_id);
    } catch (error) {
      console.error('Error in payment process:', error);
      throw new Error('Payment process failed');
    }
  }

  async saveStripePaymentIntent(paymentMethodId: string, confirmPaymentIntent: any, customer_id: string, purchase_id: string) {
    const paymentMethod = await this.stripe.paymentMethods.retrieve(paymentMethodId);
      const stripePaymentIntentData = {
        strp_paym_status: confirmPaymentIntent.status,
        strp_paym_type: String(confirmPaymentIntent.payment_method_types),
        strp_paym_country: paymentMethod.card.country,
        strp_paym_exp_month: paymentMethod.card.exp_month,
        strp_paym_exp_year: paymentMethod.card.exp_year,
        strp_paym_currency: confirmPaymentIntent.currency,
        strp_paym_amount: Number(confirmPaymentIntent.amount) / 100,
        customer_id,
        purchase_id
      };  

    const stripePaymentIntent = await this.stripePaymentIntentModel.create(stripePaymentIntentData);

    return stripePaymentIntent;  
  }
}
