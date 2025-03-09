import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../../common/document/abstract.document';

@Schema()
export class UserReset extends AbstractDocument {
  @Prop({ type: String, required: true, trim: true })
  usr_rest_email: string;

  @Prop({ type: String, required: true, trim: true })
  usr_rest_token: string;

  @Prop({ type: Date, required: true })
  usr_rest_expired_at: Date;
}

export const UserResetSchema = SchemaFactory.createForClass(UserReset);
