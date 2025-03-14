import { MailerService } from '@nestjs-modules/mailer';
import {
  GoneException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IRegistration } from '../../interfaces/users/IRegistration';
import { StripeCustomer } from '../../modules/payment/schemas/stripe-customer.schema';
import { resetPasswordTemplate } from '../../templates/reset-password';
import { UserResetRepository } from '../../modules/users/repository/user-reset.repository';
import { UserRepository } from '../../modules/users/repository/user.repository';
import { SUBJECT_RESET_PASSWORD } from '../../utils/constants/mailing/email';
import { TOKEN_AUTH_EXPIRED_AT } from '../../utils/constants/token/token-expiration';
import { generateToken } from '../../utils/randoms/generateToken';
import { UserReset } from '../users/schemas/user-reset.schema';
import { User } from '../users/schemas/user.schema';
import { hashPassword } from '../../utils/auths/hashPassword';
import { validatePassword } from '../../utils/auths/validatePassword';
import { Registration } from './dto/registration.dto';
import { SignIn } from './dto/singIn.dto';
import { StripeCustomerService } from './stripe-customer.service';
import { ForgotPassword } from './dto/forgot-password.dto';
import { Response } from 'express';
import { UsersService } from '../../modules/users/users.service';
// import moment from 'moment';

const moment = require('moment').default || require('moment');

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private mailerService: MailerService,
    private usersService: UsersService,
    private readonly userRepository: UserRepository,
    private readonly userResetRepository: UserResetRepository,
    private stripeCustomerService: StripeCustomerService,
  ) {}

  async singIn(signInDto: SignIn): Promise<{ accessToken: string }> {
    const user: User = await this.userRepository.findOne({
      usr_email: signInDto.usr_email,
    });

    const isValidPassword: boolean = await validatePassword(
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

    const accessToken: string = await this.jwtService.signAsync(payload);

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
    const user: User = await this.userRepository.findOne({
      usr_email: email,
    });

    if (!user) {
      throw new NotFoundException('The email does not exist in plateform');
    }

    user.usr_password = null;

    const token: string = generateToken(40);
    const forgotPasswordLink: string = `${process.env.FORGOT_PASSWORD_LINK}/${token}`;
    const htmlTemplate: string = resetPasswordTemplate(
      user,
      forgotPasswordLink,
    );

    try {
      await this.mailerService.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: SUBJECT_RESET_PASSWORD,
        html: htmlTemplate,
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

  async forgotPassword(
    token: string,
    forgotPasswordDto: ForgotPassword,
    res: Response,
  ): Promise<Response> {
    const { email, password } = forgotPasswordDto;
    const isChecked = await this.usersService.checkEmailTokenForgetPassword(
      email,
      token,
    );

    if (isChecked === null) {
      throw new InternalServerErrorException('Token may be not valid');
    }

    const user: User = await this.userRepository.findOne({
      usr_email: email,
    });

    if (!user) {
      throw new NotFoundException('User is not found');
    }

    if (
      moment().format('YYYY-MM-DD h:mm') >
      moment(isChecked.usr_rest_expired_at).format('YYYY-MM-DD h:mm')
    ) {
      throw new GoneException('the reset token has expired');
    }

    await this.usersService.changePassword(user._id, password);
    await this.usersService.deleteEmailTokenForgetPassword(email, token);

    return res.status(200).json({ status: 'success' });
  }
}
