import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  StripePaymentIntent,
  StripePaymentIntentSchema,
} from 'src/payment/schemas/stripe-payment-intent.schema';
import { StripeService } from 'src/payment/service/stripe.service';
import { ConfigController } from './controller/config.controller';
import { PaymentIntentController } from './controller/payment-intent.controller';
import { PaymentController } from './controller/payment.controller';
import { PaymentService } from './service/payment.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StripePaymentIntent.name, schema: StripePaymentIntentSchema },
    ]),
  ],
  controllers: [PaymentIntentController, ConfigController, PaymentController],
  providers: [PaymentService, StripeService],
})
export class PaymentModule {}
