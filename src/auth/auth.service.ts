import { MailerService } from '@nestjs-modules/mailer';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IRegistration } from 'src/interfaces/users/IRegistration';
import { StripeCustomer } from 'src/payment/schemas/stripe-customer.schema';
import { resetPasswordTemplate } from 'src/templates/reset-password';
import { UserResetRepository } from 'src/users/repository/user-reset.repository';
import { UserRepository } from 'src/users/repository/user.repository';
import { SUBJECT_RESET_PASSWORD } from 'src/utils/constant/email';
import { TOKEN_AUTH_EXPIRED_AT } from 'src/utils/constant/token-expiration';
import { generateToken } from 'src/utils/generateToken.utils';
import { UserReset } from '../users/schemas/user-reset.schema';
import { User } from '../users/schemas/user.schema';
import { hashPassword } from '../utils/hashPassword.utils';
import { validatePassword } from '../utils/validatePassword.utils';
import { Registration } from './dto/registration.dto';
import { SignIn } from './dto/singIn.dto';
import { StripeCustomerService } from './stripe-customer.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private mailerService: MailerService,
    private readonly userRepository: UserRepository,
    private readonly userResetRepository: UserResetRepository,
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

  async resetPassword(email: string): Promise<UserReset> {
    const user = await this.userRepository.findOne({
      usr_email: email,
    });

    if (!user) {
      throw new NotFoundException('The email does not exist in plateform');
    }

    user.usr_password = null;

    const token = generateToken(40);
    const forgotPasswordLink = `${process.env.FORGOT_PASSWORD_LINK}/${token}`;
    const templateHtml = resetPasswordTemplate(user, forgotPasswordLink);

    try {
      await this.mailerService.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: SUBJECT_RESET_PASSWORD,
        html: templateHtml,
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }

    const data = {
      usr_rest_email: email,
      usr_rest_token: token,
      usr_rest_expired_at: TOKEN_AUTH_EXPIRED_AT,
    };

    return await this.userResetRepository.create(data);
  }
}
