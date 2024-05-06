import { Body, Controller, Get, GoneException, HttpCode, InternalServerErrorException, NotFoundException, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/singIn.dto';
import { AuthGuard } from './auth.guard';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UsersService } from '../users/users.service';
import { SendMailService } from '../mailer/send-mail.service';
import { subject_reset_password } from '../utils/email.utils';
import { generateToken } from 'src/utils/generateToken.utils';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { UserReset } from 'src/users/schemas/user-reset.schema';
import { Response } from 'express';
import * as moment from 'moment';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('')
export class AuthController {
    constructor(private authService: AuthService, 
                private usersService: UsersService, 
                private sendMailService: SendMailService){}

    @Post("login")
    signIn(@Body() signInDto: SignInDto ) {
        return this.authService.singIn(signInDto);
    }

    @UseGuards(AuthGuard)
    @Get("profile")
    getProfile(@Req() req: any) {
        const user = req.user;

        return user;
    }

    @Post("signup")
    signUp(@Body() registerDto: RegisterDto) {
        return this.authService.signUp(registerDto);
    }

    @Post("reset-password")
    async resetPassword(@Body() { email }: ResetPasswordDto): Promise<UserReset> {
        const user = await this.usersService.findOneByEmail(email);

        if (!user) {
            throw new NotFoundException("The email is not exist in plateform");
        }

        const token = generateToken(40);
        const forgotPasswordLink = `${process.env.FORGOT_PASSWORD_LINK}/${token}`;

        const template = `
            <p>Hello ${user.usr_username},</p>
            <p>To reset your password, click on this link <a href=${forgotPasswordLink}>${forgotPasswordLink}</a></p>
        `;

        try {
            await this.sendMailService.send(process.env.EMAIL_MAILHOG_FROM, email, subject_reset_password, template);
        } catch (error) {
            throw new InternalServerErrorException();
        }

        return await this.authService.resetPassword(email, token);
    }

    @Post("forgot-password/:token")
    async forgotPassword(@Param('token') token: string, @Body() forgotPasswordDto: ForgotPasswordDto, @Res() res: Response) {
        const { email, password } = forgotPasswordDto;
        const isChecked = await this.usersService.checkEmailTokenForgetPassword(email, token);

        if (isChecked === null) {
            throw new InternalServerErrorException("Token may be not valid");
        }

        const user = await this.usersService.findOneByEmail(email);

        if (!user) {
            throw new NotFoundException("User is not found");
        }

        if (moment().format("YYYY-MM-DD h:mm") > moment(isChecked.usr_rest_expired_at).format("YYYY-MM-DD h:mm")) {
            throw new GoneException("the reset token has expired");
        }

        await this.usersService.changePassword(user._id, password);
        await this.usersService.deleteEmailTokenForgetPassword(email, token);

        return res.status(200).json({ status: "success" }); 
    }

    @UseGuards(AuthGuard)
    @Patch("change-password")
    async changePassword(@Req() req: any, @Res() res: Response, @Body() changePasswordDto: ChangePasswordDto) {
        await this.usersService.changePassword(req.user.id, changePasswordDto.password);
        
        return res.status(200).json({ status: "success" });
    }
}
