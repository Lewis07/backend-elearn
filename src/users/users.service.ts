import { Injectable } from '@nestjs/common';
import { Types } from 'mongoose';
import { IUserUpdateProfile } from 'src/interfaces/users/IUserUpdateProfile';
import { hashPassword } from '../utils/hashPassword.utils';
import { UserResetRepository } from './repository/user-reset.repository';
import { UserRepository } from './repository/user.repository';
import { UserReset } from './schemas/user-reset.schema';
import { User } from './schemas/user.schema';
import { UpdateProfile } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    private userResetRepository: UserResetRepository,
  ) {}

  async findAll() {
    return this.userRepository.find();
  }

  async changePassword(id: Types.ObjectId, password: string): Promise<User> {
    return this.userRepository.findByIdAndUpdate(id, {
      usr_password: await hashPassword(password),
    });
  }

  async updateProfile(
    id: Types.ObjectId,
    updateProfileDto: UpdateProfile,
  ): Promise<IUserUpdateProfile> {
    const user = await this.userRepository.findByIdAndUpdate(
      id,
      updateProfileDto,
    );

    const {
      _id,
      usr_username,
      usr_email,
      usr_registered_date,
      usr_type,
      usr_firstname,
      usr_lastname,
    } = user;

    return {
      _id,
      usr_username,
      usr_email,
      usr_registered_date,
      usr_type,
      usr_firstname,
      usr_lastname,
    };
  }

  async checkEmailTokenForgetPassword(
    email: string,
    token: string,
  ): Promise<UserReset> {
    return this.userResetRepository.findOne({
      usr_rest_email: email,
      usr_rest_token: token,
    });
  }

  async deleteEmailTokenForgetPassword(
    email: string,
    token: string,
  ): Promise<UserReset> {
    return this.userResetRepository.findOneAndDelete({
      usr_rest_email: email,
      usr_rest_token: token,
    });
  }
}
