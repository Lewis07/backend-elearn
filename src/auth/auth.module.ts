import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeCustomerService } from 'src/auth/stripe-customer.service';
import { UserRepository } from 'src/users/repository/user.repository';
import { UsersModule } from 'src/users/users.module';
import { SendMailModule } from '../mailer/send-mail.module';
import {
  StripeCustomer,
  StripeCustomerSchema,
} from '../payment/schemas/stripe-customer.schema';
import { UserReset, UserResetSchema } from '../users/schemas/user-reset.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { StripeCustomerRepository } from 'src/users/repository/stripe-customer.repository';

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
  providers: [
    AuthService,
    StripeCustomerService,
    UserRepository,
    StripeCustomerRepository,
  ],
})
export class AuthModule {}
