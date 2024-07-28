import { Body, Controller, Patch, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { Response } from 'express';
import { UsersService } from './users.service';

@Controller('')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @UseGuards(AuthGuard)
    @Patch("update-profile")
    async updateProfile(@Req() req: any, @Res() res: Response, @Body() updateProfileDto: UpdateProfileDto) {
        await this.usersService.updateProfile(req.user.id, updateProfileDto);

        return res.status(200).json({ status: "success" });
    }
}
