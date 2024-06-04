import { Module } from '@nestjs/common';
import { StripeCustomerService } from './stripe-customer.service';
import { StripeCustomersController } from './stripes-customers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeCustomer, StripeCustomerSchema } from './schemas/stripe-customer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StripeCustomer.name, schema: StripeCustomerSchema }
    ])
  ],
  controllers: [StripeCustomersController],
  providers: [StripeCustomerService]
})
export class StripesModule {}
