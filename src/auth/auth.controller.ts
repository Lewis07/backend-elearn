import {
  Body,
  Controller,
  Get,
  GoneException,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import * as moment from 'moment';
import { UserReset } from 'src/users/schemas/user-reset.schema';
import { User } from 'src/users/schemas/user.schema';
import { UsersService } from '../users/users.service';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { Registration } from './dto/registration.dto';
import { SignIn } from './dto/singIn.dto';
import { ResetPassword } from './dto/reset-password.dto';

@Controller('')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Post('login')
  signIn(@Body() signInDto: SignIn): Promise<{ accessToken: string }> {
    return this.authService.singIn(signInDto);
  }

  @Post('signup')
  signUp(@Body() registerDto: Registration): Promise<User> {
    return this.authService.signUp(registerDto);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    const user = req.user;

    return user;
  }

  @Post('reset-password')
  async resetPassword(@Body() { email }: ResetPassword): Promise<UserReset> {
    return this.authService.resetPassword(email);
  }

  @Post('forgot-password/:token')
  async forgotPassword(
    @Param('token') token: string,
    @Body() forgotPasswordDto: ForgotPasswordDto,
    @Res() res: Response,
  ) {
    const { email, password } = forgotPasswordDto;
    const isChecked = await this.usersService.checkEmailTokenForgetPassword(
      email,
      token,
    );

    if (isChecked === null) {
      throw new InternalServerErrorException('Token may be not valid');
    }

    const user = await this.usersService.findOneByEmail(email);

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
