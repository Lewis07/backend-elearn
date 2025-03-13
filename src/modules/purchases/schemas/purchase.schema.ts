import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as SchemaMongoose } from 'mongoose';
import { AbstractDocument } from '../../../common/document/abstract.document';
import { PaymentMethodEnum } from '../../../utils/enums/payment-method.enum';
import { CourseSchema } from 'src/modules/learning/schemas/course.schema';

export interface ICourse {
  id: string;
  title: string;
  slug: string;
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

const CourseInfoSchema = new SchemaMongoose({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  qty: {
    type: Number,
    required: true,
  },
});

@Schema({
  collection: 'purchases',
})
export class Purchase extends AbstractDocument {
  @Prop({ type: String, trim: true, required: true })
  purch_reference: string;

  @Prop({ type: Number, enum: PaymentMethodEnum })
  payment_method: PaymentMethodEnum;

  @Prop({ type: UserInfoSchema })
  user: IUserInfo;

  @Prop({ type: [CourseInfoSchema] })
  purchaseItems: ICourse[];

  @Prop({ type: Date, default: new Date().toISOString() })
  purch_date_at: Date;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);
