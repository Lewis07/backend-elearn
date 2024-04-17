import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { validatePassword } from '../utils/validatePassword.utils';
import { SignInDto } from './dto/singIn.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async singIn(signInDto: SignInDto) {
    const user = await this.usersService.findOneByUsername(signInDto.usr_username);

    if (!user) {
        throw new BadRequestException("Username not valid");
    }

    const is_valid_password = await validatePassword(signInDto.usr_password, user.usr_password);

    if (!is_valid_password) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { id: user.id, username: user.usr_username };
    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }
}
