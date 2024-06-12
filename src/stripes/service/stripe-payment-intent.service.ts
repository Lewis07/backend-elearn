import { Injectable } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { SaveStripePaymentIntentDto } from '../dto/save-stripe-payment-intent.dto';
import { InjectModel } from '@nestjs/mongoose';
import { StripePaymentIntent } from '../schemas/stripe-payment-intent.schema';
import { Model } from 'mongoose';
import { StripeCustomer } from '../schemas/stripe-customer.schema';

@Injectable()
export class StripePaymentIntentService extends StripeService {
  constructor(
    @InjectModel(StripePaymentIntent.name)
    private stripePaymentIntentModel: Model<StripePaymentIntent>,
    @InjectModel(StripeCustomer.name)
    private stripeCustomerModel: Model<StripeCustomer>,
  ) {
    super();
  }

  async create(
    saveStripePaymentIntentDto: SaveStripePaymentIntentDto,
    customerId: string,
    paymentMethodId: string
  ) {
    const { amount, currency, purchase_id } = saveStripePaymentIntentDto;

    const dataPaymentIntent = {
      payment_method_types: ['card'],
      amount: amount * 100,
      currency,
      customer: customerId,
      payment_method: paymentMethodId,
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

      this.updateStripeCustomer(paymentMethodId, customerId);

      return this.saveStripePaymentIntent(
        paymentMethodId,
        confirmPaymentIntent,
        customerId,
        purchase_id,
      );
    } catch (error) {
      console.error('Error in payment process:', error);
      throw new Error('Payment process failed');
    }
  }

  async saveStripePaymentIntent(
    paymentMethodId: string,
    confirmPaymentIntent: any,
    customerId: string,
    purchaseId: string,
  ) {
    const paymentMethod =
      await this.stripe.paymentMethods.retrieve(paymentMethodId);
    const stripePaymentIntentData = {
      strp_paym_status: confirmPaymentIntent.status,
      strp_paym_type: String(confirmPaymentIntent.payment_method_types),
      strp_paym_country: paymentMethod.card.country,
      strp_paym_exp_month: paymentMethod.card.exp_month,
      strp_paym_exp_year: paymentMethod.card.exp_year,
      strp_paym_currency: confirmPaymentIntent.currency,
      strp_paym_amount: Number(confirmPaymentIntent.amount) / 100,
      customer_id: customerId,
      purchase_id: purchaseId,
    };

    const stripePaymentIntent = await this.stripePaymentIntentModel.create(
      stripePaymentIntentData,
    );

    return stripePaymentIntent;
  }

  async updateStripeCustomer(paymentMethodId: string, customerId: string) {
    const paymentMethod = await this.stripe.paymentMethods.retrieve(paymentMethodId);
    const { city, country, postal_code, line1, line2 } = paymentMethod.billing_details.address;
    const { phone } = paymentMethod.billing_details;

    try {
      await this.stripeCustomerModel.findOneAndUpdate(
        { customer_id: customerId },
        {
          strp_cus_city: city ?? null,
          strp_cus_country: country ?? null,
          strp_cus_postal_code: postal_code ?? null,
          strp_cus_postal_address_line1: line1 ?? null,
          strp_cus_postal_address_line2: line2 ?? null,
          strp_cus_phone: phone ?? null,
        },
      );
    } catch (error) {
      console.error('Error updating Stripe customer:', error);
      throw error;
    }
  }
}
