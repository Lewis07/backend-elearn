import { PaymentMethodEnum } from "../../utils/enum/payment-method-enum.utils";
import { Course } from "../../courses/schemas/course.schema";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
// import { PurchaseItem } from "./purchase-item.schema";

@Schema({
    timestamps: true
})
export class Purchase {
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

    // @Prop({ type: [PurchaseItem], default: []})
    // purchaseItems: PurchaseItem[];
}

export const PurchaseSchema = SchemaFactory.createForClass(Purchase);