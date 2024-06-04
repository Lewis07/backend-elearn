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
    strp_cus_created: Date;
}

export const StripeCustomerSchema = SchemaFactory.createForClass(StripeCustomer);