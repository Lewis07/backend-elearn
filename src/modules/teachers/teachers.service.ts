import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Teacher } from './schemas/teacher.schema';
import mongoose, { Model } from 'mongoose';
import { SaveTeacherDto } from './dto/save-teacher.dto';
import { User } from '../users/schemas/user.schema';
import { UserTypeEnum } from '../../utils/enums/user-type.enum';

@Injectable()
export class TeachersService {
  constructor(
    @InjectModel(Teacher.name) private teacherModel: Model<Teacher>,
    @InjectModel(User.name) private userModel: Model<Teacher>,
  ) {}

  async findAll() {
    return this.teacherModel.find().sort({ _id: -1 });
  }

  async findById(id: string) {
    const isvalidId = mongoose.isValidObjectId(id);

    if (!isvalidId) {
      throw new BadRequestException(
        'Wrong mongoose id, please enter a valid id',
      );
    }

    const teacher = await this.teacherModel.findById(id);

    if (!teacher) {
      throw new NotFoundException('Teacher not found');
    }

    return teacher;
  }

  async store(userId: string, addTeacher: SaveTeacherDto) {
    let data = { ...addTeacher, user_id: userId };

    const teacher = await this.teacherModel.create(data);

    if (teacher) {
      const user = await this.userModel.findById(userId);

      if (user) {
        await this.userModel.findByIdAndUpdate(userId, {
          usr_type: UserTypeEnum.TEACHER,
        });
      }
    }

    return teacher;
  }

  async update(id: string, teacher: SaveTeacherDto) {
    await this.findById(id);

    return this.teacherModel.findByIdAndUpdate(id, teacher, { new: true });
  }

  async delete(id: string) {
    await this.findById(id);

    return this.teacherModel.findByIdAndDelete(id);
  }
}
