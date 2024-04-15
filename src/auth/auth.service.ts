import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async singIn(
    usr_username: string,
    usr_password: string,
  ) {
    const user = await this.usersService.findOneByUsername(usr_username);

    if (!user) {
        throw new BadRequestException("Username not valid");
    }

    if (user?.usr_password !== usr_password) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const payload = { id: user.id, username: user.usr_username };
    const access_token = await this.jwtService.signAsync(payload);

    return { access_token };
  }
}
