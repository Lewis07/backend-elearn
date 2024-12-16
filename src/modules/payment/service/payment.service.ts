import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StripeService } from 'src/modules/payment/service/stripe.service';
import {
  IBillingDetail,
  StripePaymentIntent,
} from '../schemas/stripe-payment-intent.schema';

interface IPayInfoData {
  strp_paym_amount: number;
  strp_paym_currency: string;
  strp_paym_status: string;
  strp_paym_type: string;
  strp_paym_exp_month: number;
  strp_paym_exp_year: number;
  strp_paym_billing_details: IBillingDetail;
  strp_customer_id: string;
}

@Injectable()
export class PaymentService extends StripeService {
  constructor(
    @InjectModel(StripePaymentIntent.name)
    private stripePaymentIntentModel: Model<StripePaymentIntent>,
  ) {
    super();
  }

  async createPaymentIntent(data: any) {
    try {
      return await this.stripe.paymentIntents.create(data);
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  async savePaymentInformation(purchaseId: string) {
    try {
      const chargesSearched = await this.stripe.charges.search({
        query: `metadata[\'purchase_id\']:\'${purchaseId}\'`,
      });

      const charges = chargesSearched.data[0];
      const payInfoData: IPayInfoData = {
        strp_paym_amount: charges.amount / 100,
        strp_paym_currency: charges.currency,
        strp_paym_status: charges.status,
        strp_paym_type: charges.payment_method_details.type,
        strp_paym_exp_month: charges.payment_method_details.card.exp_month,
        strp_paym_exp_year: charges.payment_method_details.card.exp_year,
        strp_paym_billing_details: charges.billing_details,
        strp_customer_id: charges.customer as string,
      };

      return await this.stripePaymentIntentModel.create(payInfoData);
    } catch (error) {
      console.error('Error saving payment information:', error);
      throw error;
    }
  }
}
