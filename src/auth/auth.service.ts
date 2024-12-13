import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IRegistration } from 'src/interfaces/users/IRegistration';
import { StripeCustomer } from 'src/payment/schemas/stripe-customer.schema';
import { UserRepository } from 'src/users/repository/user.repository';
import { UserReset } from '../users/schemas/user-reset.schema';
import { User } from '../users/schemas/user.schema';
import { hashPassword } from '../utils/hashPassword.utils';
import { validatePassword } from '../utils/validatePassword.utils';
import { SignIn } from './dto/singIn.dto';
import { StripeCustomerService } from './stripe-customer.service';
import { Registration } from './dto/registration.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly userRepository: UserRepository,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserReset.name) private userResetModel: Model<UserReset>,
    private stripeCustomerService: StripeCustomerService,
  ) {}

  async singIn(signInDto: SignIn): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findOne({
      usr_email: signInDto.usr_email,
    });

    const isValidPassword = await validatePassword(
      signInDto.usr_password,
      user?.usr_password,
    );

    if (!user || !isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      id: user._id,
      username: user.usr_username,
      email: user.usr_email,
      firstname: user.usr_firstname,
      lastname: user.usr_lastname,
      photo: user.usr_photo,
      type: user.usr_type,
      role: user.usr_role,
      customerId: user.stripe_customer_id,
    };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }

  async signUp(registerDto: Registration): Promise<User> {
    const hashedPassword: string = await hashPassword(registerDto.usr_password);
    const data: IRegistration = {
      ...registerDto,
      usr_password: hashedPassword,
    };
    const userCreated: User = await this.userRepository.create(data);
    let customerId: string | null = null;

    try {
      const stripeCustomer: StripeCustomer =
        await this.stripeCustomerService.createCustomer(
          userCreated.usr_username,
          userCreated.usr_email,
        );
      customerId = stripeCustomer.customer_id;
    } catch (error: any) {
      console.error(error);
    }

    const userWithStripeCustomerId: User =
      await this.userRepository.findByIdAndUpdate(userCreated._id, {
        stripe_customer_id: customerId,
      });

    userWithStripeCustomerId.usr_password = null;

    return userWithStripeCustomerId;
  }

  async resetPassword(email: string, token: string): Promise<UserReset> {
    const now = new Date();
    const tokenExpiredAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const user = await this.userRepository.findOne({
      usr_email: email,
    });

    if (!user) {
      throw new BadRequestException('Email is not found');
    }

    const data = {
      usr_rest_email: email,
      usr_rest_token: token,
      usr_rest_expired_at: tokenExpiredAt,
    };

    return await this.userResetModel.create(data);
  }
}
