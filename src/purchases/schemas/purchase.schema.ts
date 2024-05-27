import { PaymentMethodEnum } from "../../utils/enum/payment-method-enum.utils";
import { Course } from "../../courses/schemas/course.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({
    timestamps: true
})
export class Purchase {
    _id: mongoose.Types.ObjectId;

    @Prop({ trim: true, required: true })
    purch_reference: string;

    @Prop({ trim: true, required: true })
    purch_firstname: string;

    @Prop({ trim: true, required: true })
    purch_lastname: string;

    @Prop({ required: true })
    purch_zipcode: number

    @Prop({ trim: true, required: true })
    purch_country: string;

    @Prop({ trim: true, required: true })
    purch_address: string;

    @Prop({ required: true })
    purch_card_number: number;

    @Prop({ default: new Date().toISOString() })
    purch_date_at: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true })
    user_id: Course;

    @Prop({ type: String, enum: PaymentMethodEnum })
    payment_method_id: PaymentMethodEnum;
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);