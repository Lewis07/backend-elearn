import { Module } from '@nestjs/common';
import { StripeCustomersController } from './controller/stripes-customers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeCustomer, StripeCustomerSchema } from './schemas/stripe-customer.schema';
import { StripeCustomerService } from './service/stripe-customer.service';
import { StripePaymentIntentsController } from './controller/stripe-payment-intents.controller';
import { StripePaymentIntentService } from './service/stripe-payment-intent.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StripeCustomer.name, schema: StripeCustomerSchema }
    ])
  ],
  controllers: [StripeCustomersController, StripePaymentIntentsController],
  providers: [StripeCustomerService, StripePaymentIntentService]
})
export class StripesModule {}
