import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Course } from "../../courses/schemas/course.schema";
import { User } from "../../users/schemas/user.schema";
import mongoose from "mongoose";

@Schema({
    timestamps: true
})
export class Comment {
    @Prop({ required: true })
    comm_rating: string;

    @Prop({ trim: true, required: true })
    comm_content: string;

    @Prop({ type: mongoose.Schema.ObjectId, ref: "User" })
    auhor_id: User;

    @Prop({ type: mongoose.Schema.ObjectId, ref: "Course", required: true })
    course_id: Course;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);