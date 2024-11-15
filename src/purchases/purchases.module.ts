import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeCustomerService } from 'src/payment/service/stripe-customer.service';
import { Course, CourseSchema } from '../courses/schemas/course.schema';
import {
  StripeCustomer,
  StripeCustomerSchema,
} from '../payment/schemas/stripe-customer.schema';
import {
  StripePaymentIntent,
  StripePaymentIntentSchema,
} from '../payment/schemas/stripe-payment-intent.schema';
import { UserReset, UserResetSchema } from '../users/schemas/user-reset.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { PurchasesController } from './purchases.controller';
import { PurchasesService } from './purchases.service';
import {
  PurchaseItem,
  PurchaseItemSchema,
} from './schemas/purchase-item.schema';
import { Purchase, PurchaseSchema } from './schemas/purchase.schema';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => ({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
      }),
    }),
    MongooseModule.forFeature([
      { name: Purchase.name, schema: PurchaseSchema },
      { name: PurchaseItem.name, schema: PurchaseItemSchema },
      { name: Course.name, schema: CourseSchema },
      { name: StripeCustomer.name, schema: StripeCustomerSchema },
      { name: StripePaymentIntent.name, schema: StripePaymentIntentSchema },
      { name: UserReset.name, schema: UserResetSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [PurchasesService, UsersService, StripeCustomerService],
  controllers: [PurchasesController],
})
export class PurchasesModule {}
