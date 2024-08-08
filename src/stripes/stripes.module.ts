import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeCustomer, StripeCustomerSchema } from './schemas/stripe-customer.schema';
import { StripeCustomerService } from './service/stripe-customer.service';
import { StripePaymentIntentService } from './service/stripe-payment-intent.service';
import { StripePaymentIntent, StripePaymentIntentSchema } from './schemas/stripe-payment-intent.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StripeCustomer.name, schema: StripeCustomerSchema },
      { name: StripePaymentIntent.name, schema: StripePaymentIntentSchema }
    ])
  ],
  controllers: [],
  providers: [StripeCustomerService, StripePaymentIntentService]
})
export class StripesModule {}
