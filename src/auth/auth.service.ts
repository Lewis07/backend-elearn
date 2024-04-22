import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { validatePassword } from '../utils/validatePassword.utils';
import { SignInDto } from './dto/singIn.dto';
import { RegisterDto } from './dto/register.dto';
import { hashPassword } from '../utils/hashPassword.utils';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>
  ) {}

  async singIn(signInDto: SignInDto) {
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

  async signUp(registerDto: RegisterDto) {
    const hash_password = await hashPassword(registerDto.usr_password);
    const data = {...registerDto, usr_password: hash_password};

    return this.userModel.create(data);
  }
}
