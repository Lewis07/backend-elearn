import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';

@Controller('')
export class UsersController {
    constructor(private authService: AuthService) {}

    @UseGuards(AuthGuard)
    @Post("update-profile")
    async updateProfile(@Req() req: any, @Res() res: Response, @Body() updateProfileDto: UpdateProfileDto) {
        await this.authService.updateProfile(req.user.id, updateProfileDto);

        return res.status(200).json({ status: "success" });
    }
}
