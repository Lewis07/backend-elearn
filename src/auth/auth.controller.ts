import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/singIn.dto';
import { AuthGuard } from './auth.guard';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService){}

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
}
