import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

export interface IBillingDetail {
  name: string;
  email: string;
  address: {
    city: string;
    line1: string;
    postal_code: string;
  };
}

export const BillingDetailsSchema = new MongooseSchema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  address: {
    city: { type: String, required: true },
    line1: { type: String, required: true },
    postal_code: { type: String, required: true },
  },
});

@Schema({
  timestamps: true,
})
export class StripePaymentIntent {
  @Prop({ type: Number, required: true })
  strp_paym_amount: number;

  @Prop({ type: String, required: true })
  strp_paym_currency: string;

  @Prop({ type: String, required: true })
  strp_paym_status: string;

  @Prop({ type: String, required: true })
  strp_paym_type: string;

  @Prop({ type: Number, required: true })
  strp_paym_exp_month: number;

  @Prop({ type: Number, required: true })
  strp_paym_exp_year: number;

  @Prop({ type: BillingDetailsSchema, required: true })
  strp_paym_billing_details: IBillingDetail;

  @Prop({ type: String })
  strp_customer_id: string;

  @Prop({ type: String })
  purchase_id: string;
}

export const StripePaymentIntentSchema =
  SchemaFactory.createForClass(StripePaymentIntent);
