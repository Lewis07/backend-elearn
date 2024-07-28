import { Body, Controller, Get, Patch, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Response } from 'express';
import { UsersService } from './users.service';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';

@Controller('')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @UseGuards(AuthGuard)
    @Get("users")
    async list() {
        return this.usersService.findAll();
    }

    @UseGuards(AuthGuard)

    @Patch("update-profile")
    async updateProfile(@Req() req: any, @Res() res: Response, @Body() updateProfileDto: UpdateProfileDto) {
        await this.usersService.updateProfile(req.user.id, updateProfileDto);

        return res.status(200).json({ status: "success" });
    }

    @UseGuards(AuthGuard)
    @Patch("change-password")
    async changePassword(@Req() req: any, @Res() res: Response, @Body() changePasswordDto: ChangePasswordDto) {
        await this.usersService.changePassword(req.user.id, changePasswordDto.password);
        
        return res.status(200).json({ status: "success" });
    }
}
