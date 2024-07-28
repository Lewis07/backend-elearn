import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import mongoose, { Model } from 'mongoose';
import { UserReset } from './schemas/user-reset.schema';
import { hashPassword } from '../utils/hashPassword.utils';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(UserReset.name) private userResetModel: Model<UserReset>,
  ) {}

  async findAll() {
    return this.userModel.find().sort({ _id: -1 });
  }

  async findOneByEmail(email: string) {
    return this.userModel
      .findOne({ usr_email: email })
      .select('-createdAt -updatedAt');
  }

  async checkEmailTokenForgetPassword(
    email: string,
    token: string,
  ): Promise<UserReset> {
    return this.userResetModel.findOne({
      usr_rest_email: email,
      usr_rest_token: token,
    });
  }

  async changePassword(id: mongoose.Types.ObjectId, password: string) {
    return this.userModel.findByIdAndUpdate(id, {
      usr_password: await hashPassword(password),
    });
  }

  async deleteEmailTokenForgetPassword(
    email: string,
    token: string,
  ): Promise<UserReset> {
    return this.userResetModel.findOneAndDelete({
      usr_rest_email: email,
      usr_rest_token: token,
    });
  }

  async updateProfile(
    id: mongoose.Types.ObjectId,
    updateProfileDto: UpdateProfileDto,
  ) {
    const response = await this.userModel.findByIdAndUpdate(id, updateProfileDto, { new: true });

    const {
      _id,
      usr_username,
      usr_email,
      usr_registered_date,
      usr_type,
      usr_firstname,
      usr_lastname,
    } = response;

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

  async findOneById(userId: string) {
    return this.userModel
      .findOne({ _id: userId })
      .select('stripe_customer_id');
  }
}
