import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

const BillingDetailsSchema = new MongooseSchema({
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
  @Prop({ required: true })
  strp_paym_amount: number;

  @Prop({ required: true })
  strp_paym_currency: string;

  @Prop({ required: true })
  strp_paym_status: string;

  @Prop({ required: true })
  strp_paym_type: string;

  @Prop({ required: true })
  strp_paym_exp_month: number;

  @Prop({ required: true })
  strp_paym_exp_year: number;

  @Prop({ type: BillingDetailsSchema, required: true })
  strp_paym_billing_details: {
    name: string;
    email: string;
    address: {
      city: string;
      line1: string;
      postal_code: string;
    };
  };

  @Prop()
  strp_customer_id: string;

  @Prop()
  purchase_id: string;
}

export const StripePaymentIntentSchema =
  SchemaFactory.createForClass(StripePaymentIntent);
