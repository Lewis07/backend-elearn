import { BadRequestException, ClassSerializerInterceptor, Injectable, UnauthorizedException, UseInterceptors } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { validatePassword } from '../utils/validatePassword.utils';
import { SignInDto } from './dto/singIn.dto';
import { RegisterDto } from './dto/register.dto';
import { hashPassword } from '../utils/hashPassword.utils';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { plainToClass } from 'class-transformer';
import { UserReset } from '../users/schemas/user-reset.schema';
import { UpdateProfileDto } from '../users/dto/update-profile.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserReset.name) private userResetModel: Model<UserReset>
  ) {}

  async singIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByEmail(signInDto.usr_email);

    if (!user) {
      throw new BadRequestException("Email is not found");
    }

    const is_valid_password = await validatePassword(signInDto.usr_password, user.usr_password);

    if (!is_valid_password) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { id: user.id, username: user.usr_username, email: user.usr_email };
    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }

  @UseInterceptors(ClassSerializerInterceptor)
  async signUp(registerDto: RegisterDto): Promise<User> {
    const hash_password = await hashPassword(registerDto.usr_password);
    const data = {...registerDto, usr_password: hash_password};
    const user = await this.userModel.create(data);

    return plainToClass(User, user, { excludeExtraneousValues: true});
  }

  async resetPassword(email: string, token: string): Promise<UserReset> {
    const now = new Date();
    const tokenExpiredAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const data = {
      usr_rest_email: email,
      usr_rest_token: token,
      usr_rest_expired_at: tokenExpiredAt
    };

    return await this.userResetModel.create(data);
  }
}
