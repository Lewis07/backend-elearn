import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectModel } from '@nestjs/mongoose';
import { StripeCustomer } from './schemas/stripe-customer.schema';
import { Model } from 'mongoose';

@Injectable()
export class StripeCustomerService {
  private stripe: Stripe;

  constructor(@InjectModel(StripeCustomer.name) private stripeCustomerModel: Model<StripeCustomer>) {
    const apiVersion = process.env.STRIPE_API_VERSION;
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: apiVersion as Stripe.StripeConfig['apiVersion'],
    });
  }

  async createcustomer(name: string, email: string) {
    const customerStripe = await this.stripe.customers.create({
        name,
        email
    });

    const data = {
        customer_id: customerStripe.id,
        strp_cus_email: email,
        strp_cus_name: name,
        strp_cus_city: null,
        strp_cus_country: null,
        strp_cus_postal_code: null
    };

    return await this.stripeCustomerModel.create(data);
  }
}
