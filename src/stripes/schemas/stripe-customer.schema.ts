import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true
})
export class StripeCustomer {
    @Prop()
    customer_id: string;

    @Prop()
    strp_cus_email: string;

    @Prop()
    strp_cus_name: string;

    @Prop()
    strp_cus_city?: string;

    @Prop()
    strp_cus_country?: string;

    @Prop()
    strp_cus_postal_code?: string;

    @Prop()
    strp_cus_phone?: string;

    @Prop()
    strp_cus_postal_address_line1?: string;

    @Prop()
    strp_cus_postal_address_line2?: string;

    @Prop({ default: new Date().toISOString() })
    strp_cus_created: Date;
}

export const StripeCustomerSchema = SchemaFactory.createForClass(StripeCustomer);