import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { ChangePassword } from '../auth/dto/change-password.dto';
import { UpdateProfile } from './dto/update-profile.dto';
import { UsersService } from './users.service';

@Controller()
@ApiBearerAuth()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get('users')
  async list() {
    return this.usersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  getProfile(@Req() req: any) {
    const user = req.user;

    return user;
  }

  @UseGuards(AuthGuard)
  @Patch('update-profile')
  async updateProfile(
    @Req() req: any,
    @Body() updateProfileDto: UpdateProfile,
  ) {
    return this.usersService.updateProfile(req.user.id, updateProfileDto);
  }

  @UseGuards(AuthGuard)
  @Patch('change-password')
  async changePassword(
    @Req() req: any,
    @Body() changePasswordDto: ChangePassword,
  ) {
    return await this.usersService.changePassword(
      req.user.id,
      changePasswordDto.password,
    );
  }
}
