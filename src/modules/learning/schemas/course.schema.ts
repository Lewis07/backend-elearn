import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { AbstractDocument } from 'src/common/document/abstract.document';
import { User } from '../../users/schemas/user.schema';
import { LevelEnum } from '../../../utils/enums/level.enum';

@Schema({
  collection: 'courses',
})
export class Course extends AbstractDocument {
  @Prop({ trim: true, required: true })
  crs_title: string;

  @Prop({ trim: true, required: true })
  crs_slug: string;

  @Prop({ trim: true, required: true })
  crs_description: string;

  @Prop({ required: true })
  crs_price: number;

  @Prop({ default: 0 })
  crs_new_price: number;

  @Prop({ default: false })
  crs_isPaid: boolean;

  @Prop()
  crs_photo: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  author: Omit<User, 'usr_password'>;

  @Prop({ type: String, enum: LevelEnum })
  level_id: LevelEnum;

  createdAt: Date;
  updatedAt: Date;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
