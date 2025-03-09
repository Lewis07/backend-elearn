import { Prop, Schema } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema()
export class AbstractDocument {
  _id: Types.ObjectId;

  @Prop({ type: Date, required: true, default: new Date().toISOString() })
  created_at?: Date;

  @Prop({ type: Date, required: true, default: new Date().toISOString() })
  updated_at?: Date;
}
