import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { PaymentMethodEnum } from '../../utils/enum/payment-method-enum.utils';
import { ObjectId, Schema as SchemaMongoose } from 'mongoose';

export interface ICourse {
  id: string;
  title: string;
  image: string;
  price: number;
  qty: number;
}

export interface IUserInfo {
  id: string;
  name: string;
  email: string;
  address: {
    city: string;
    line1: string;
    postal_code: string;
  };
}

const UserInfoSchema = new SchemaMongoose({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    city: {
      type: String,
      required: true,
    },
    line1: {
      type: String,
      required: true,
    },
    postal_code: {
      type: String,
      required: true,
    },
  },
});

@Schema({
  timestamps: true,
})
export class Purchase {
  _id: ObjectId;

  @Prop({ trim: true, required: true })
  purch_reference: string;

  @Prop({ type: String, enum: PaymentMethodEnum })
  payment_method: PaymentMethodEnum;

  @Prop({ type: UserInfoSchema })
  user: IUserInfo;

  @Prop()
  purchaseItems: ICourse[];

  @Prop({ default: new Date().toISOString() })
  purch_date_at: Date;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
