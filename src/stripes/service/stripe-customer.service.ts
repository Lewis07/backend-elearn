import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { StripeCustomer } from '../schemas/stripe-customer.schema';
import { StripeService } from './stripe.service';

@Injectable()
export class StripeCustomerService extends StripeService {

  constructor(@InjectModel(StripeCustomer.name) private stripeCustomerModel: Model<StripeCustomer>) {
    super();
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
