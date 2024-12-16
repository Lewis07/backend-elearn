import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/common/document/abstract.document';

@Schema()
export class UserReset extends AbstractDocument {
  @Prop({ required: true, trim: true })
  usr_rest_email: string;

  @Prop({ required: true, trim: true })
  usr_rest_token: string;

  @Prop({ required: true })
  usr_rest_expired_at: Date;
}

export const UserResetSchema = SchemaFactory.createForClass(UserReset);
