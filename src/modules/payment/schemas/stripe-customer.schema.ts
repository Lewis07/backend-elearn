import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../../common/document/abstract.document';

@Schema({
  timestamps: true,
})
export class StripeCustomer extends AbstractDocument {
  @Prop({ type: String })
  customer_id: string;

  @Prop({ type: String })
  strp_cus_email: string;

  @Prop({ type: String })
  strp_cus_name: string;

  @Prop({ type: String })
  strp_cus_city?: string;

  @Prop({ type: String })
  strp_cus_country?: string;

  @Prop({ type: String })
  strp_cus_postal_code?: string;

  @Prop({ type: String })
  strp_cus_phone?: string;

  @Prop({ type: String })
  strp_cus_postal_address_line1?: string;

  @Prop({ type: String })
  strp_cus_postal_address_line2?: string;

  @Prop({ type: Date, default: new Date().toISOString() })
  strp_cus_created: Date;
}

export const StripeCustomerSchema =
  SchemaFactory.createForClass(StripeCustomer);
