import { Controller, Post } from '@nestjs/common';
import { StripeCustomerService } from './stripe-customer.service';

@Controller('stripe/customers')
export class StripeCustomersController {
    constructor(private stripeCustomerService: StripeCustomerService) {}
}
