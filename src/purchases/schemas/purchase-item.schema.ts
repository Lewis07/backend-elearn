import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Purchase } from "./purchase.schema";
import mongoose from "mongoose";
import { Course } from "../../courses/schemas/course.schema";

@Schema({
    timestamps: true
})
export class PurchaseItem {
    @Prop()
    crs_price_at_purchase: number;

    @Prop({ type: mongoose.Schema.ObjectId, ref: "Purchase" })
    purchase_id: Purchase;

    @Prop({ type: mongoose.Schema.ObjectId, ref: "Course"})
    course_id: Course;
}

export const PurchaseItemSchema = SchemaFactory.createForClass(PurchaseItem);