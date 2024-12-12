import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/user.schema';
import { SendMailModule } from '../mailer/send-mail.module';
import { UserReset, UserResetSchema } from '../users/schemas/user-reset.schema';
import {
  StripeCustomer,
  StripeCustomerSchema,
} from '../payment/schemas/stripe-customer.schema';
import { StripeCustomerService } from 'src/payment/service/stripe-customer.service';
import { UserRepository } from 'src/users/repository/user.repository';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: async () => ({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
      }),
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserReset.name, schema: UserResetSchema },
      { name: StripeCustomer.name, schema: StripeCustomerSchema },
    ]),
    SendMailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, StripeCustomerService, UserRepository],
})
export class AuthModule {}
