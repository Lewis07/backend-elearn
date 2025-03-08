import { Injectable } from '@nestjs/common';
import { StripeCustomerRepository } from '../../modules/users/repository/stripe-customer.repository';
import { StripeService } from '../payment/service/stripe.service';

@Injectable()
export class StripeCustomerService extends StripeService {
  constructor(private stripeCustomerRepository: StripeCustomerRepository) {
    super();
  }

  async createCustomer(name: string, email: string) {
    const customerStripe = await this.stripe.customers.create({
      name,
      email,
    });

    const data = {
      customer_id: customerStripe.id,
      strp_cus_email: email,
      strp_cus_name: name,
      strp_cus_city: null,
      strp_cus_country: null,
      strp_cus_postal_code: null,
      strp_cus_postal_address_line1: null,
      strp_cus_postal_address_line2: null,
      strp_cus_phone: null,
    };

    try {
      return await this.stripeCustomerRepository.create(data);
    } catch (error) {
      console.error('Error creating stripe customer:', error);
      throw error;
    }
  }

  async updateStripeCustomer(paymentMethodId: string) {
    const paymentMethod =
      await this.stripe.paymentMethods.retrieve(paymentMethodId);

    const { customer: customerId } = paymentMethod;

    const { city, country, postal_code, line1, line2 } =
      paymentMethod.billing_details.address;
    const { phone } = paymentMethod.billing_details;

    try {
      await this.stripeCustomerRepository.findOneAndUpdate(
        { customer_id: customerId as string },
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
      console.error('Error updating stripe customer:', error);
      throw error;
    }
  }
}
