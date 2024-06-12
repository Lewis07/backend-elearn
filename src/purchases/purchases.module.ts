import { Module } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Purchase, PurchaseSchema } from './schemas/purchase.schema';
import { Course, CourseSchema } from '../courses/schemas/course.schema';
import {
  PurchaseItem,
  PurchaseItemSchema,
} from './schemas/purchase-item.schema';
import { StripePaymentIntentService } from '../stripes/service/stripe-payment-intent.service';
import { UsersService } from '../users/users.service';
import {
  StripePaymentIntent,
  StripePaymentIntentSchema,
} from '../stripes/schemas/stripe-payment-intent.schema';
import {
  StripeCustomer,
  StripeCustomerSchema,
} from '../stripes/schemas/stripe-customer.schema';
import { UserReset, UserResetSchema } from '../users/schemas/user-reset.schema';
import { User, UserSchema } from '../users/schemas/user.schema';

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
  providers: [
    PurchasesService,
    StripePaymentIntentService,
    UsersService,
    StripePaymentIntentService,
  ],
  controllers: [PurchasesController],
})
export class PurchasesModule {}
