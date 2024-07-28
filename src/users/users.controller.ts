import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from './users.service';
import { ChangePasswordDto } from '../auth/dto/change-password.dto';

@Controller('')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('users')
  async list() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Patch('change-password')
  async changePassword(
    @Req() req: any,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.usersService.changePassword(
      req.user.id,
      changePasswordDto.password,
    );
  }

  @UseGuards(AuthGuard)
  @Patch('update-profile')
  async updateProfile(
    @Req() req: any,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const user = await this.usersService.updateProfile(
      req.user.id,
      updateProfileDto,
    );
    const { usr_username, usr_email, usr_firstname, usr_lastname } = user;

    return { usr_username, usr_email, usr_firstname, usr_lastname };
  }
}
