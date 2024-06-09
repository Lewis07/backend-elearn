import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema({
    timestamps: true
})
export class StripePaymentIntent {
    @Prop()
    strp_paym_status: string;

    @Prop()
    strp_paym_type: string;

    @Prop()
    strp_paym_country: string;

    @Prop()
    strp_paym_exp_month: number;

    @Prop()
    strp_paym_exp_year: number;

    @Prop()
    strp_paym_currency: string;

    @Prop()
    strp_paym_amount: number;

    @Prop()
    customer_id: string;

    @Prop()
    purchase_id: string;
}

export const StripePaymentIntentSchema = SchemaFactory.createForClass(StripePaymentIntent);