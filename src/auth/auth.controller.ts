import { Body, Controller, Param, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { UserReset } from 'src/users/schemas/user-reset.schema';
import { User } from 'src/users/schemas/user.schema';
import { AuthService } from './auth.service';
import { ForgotPassword } from './dto/forgot-password.dto';
import { Registration } from './dto/registration.dto';
import { ResetPassword } from './dto/reset-password.dto';
import { SignIn } from './dto/singIn.dto';

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  signIn(@Body() signInDto: SignIn): Promise<{ accessToken: string }> {
    return this.authService.singIn(signInDto);
  }

  @Post('signup')
  signUp(@Body() registerDto: Registration): Promise<User> {
    return this.authService.signUp(registerDto);
  }

  @Post('reset-password')
  async resetPassword(@Body() { email }: ResetPassword): Promise<UserReset> {
    return this.authService.resetPassword(email);
  }

  @Post('forgot-password/:token')
  async forgotPassword(
    @Param('token') token: string,
    @Body() forgotPasswordDto: ForgotPassword,
    @Res() res: Response,
  ): Promise<Response> {
    return this.authService.forgotPassword(token, forgotPasswordDto, res);
  }
}
