import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { User } from "../../users/schemas/user.schema";
import mongoose from "mongoose";

@Schema({
    timestamps: true
})
export class Teacher {
    @Prop({ trim: true })
    tchr_biography: string;

    @Prop({ trim: true })
    tchr_domain: string;

    @Prop({ type: mongoose.Schema.ObjectId, ref: "User" })
    user_id: User;
}

export const TeacherSchema = SchemaFactory.createForClass(Teacher);