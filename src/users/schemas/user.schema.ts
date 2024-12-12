import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/core/document/abstract.document';
import { RoleEnum } from 'src/utils/enum/role.enum';
import { UserTypeEnum } from '../../utils/enum/user-type-enum.utils';

@Schema({
  timestamps: true,
})
export class User extends AbstractDocument {
  @Prop({ trim: true })
  usr_photo?: string;

  @Prop({ required: true, trim: true })
  usr_username: string;

  @Prop({ trim: true })
  usr_firstname?: string;

  @Prop({ trim: true })
  usr_lastname?: string;

  @Prop({ required: true, unique: true, trim: true })
  usr_email: string;

  @Prop({ required: true, trim: true, minlength: 8 })
  usr_password: string;

  @Prop({ required: true, default: new Date().toISOString() })
  usr_registered_date: Date;

  createdAt: Date;

  updatedAt: Date;

  @Prop({ default: UserTypeEnum.STUDENT })
  usr_type: UserTypeEnum;

  @Prop({ trim: true })
  stripe_customer_id: string;

  @Prop({ required: true, enum: RoleEnum, default: RoleEnum.USER })
  usr_role: RoleEnum;
}

export const UserSchema = SchemaFactory.createForClass(User);
