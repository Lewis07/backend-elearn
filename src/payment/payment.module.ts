import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  StripeCustomer,
  StripeCustomerSchema,
} from 'src/payment/schemas/stripe-customer.schema';
import {
  StripePaymentIntent,
  StripePaymentIntentSchema,
} from 'src/payment/schemas/stripe-payment-intent.schema';
import { StripeService } from 'src/payment/service/stripe.service';
import { ConfigController } from './controller/config.controller';
import { PaymentIntentController } from './controller/payment-intent.controller';
import { PaymentService } from './service/payment.service';
import { StripeCustomerService } from './service/stripe-customer.service';
import { PaymentController } from './controller/payment.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StripeCustomer.name, schema: StripeCustomerSchema },
      { name: StripePaymentIntent.name, schema: StripePaymentIntentSchema },
    ]),
  ],
  controllers: [PaymentIntentController, ConfigController, PaymentController],
  providers: [PaymentService, StripeService, StripeCustomerService],
})
export class PaymentModule {}
