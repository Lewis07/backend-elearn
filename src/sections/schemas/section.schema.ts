import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { Course } from "../../courses/schemas/course.schema";

@Schema({
    timestamps: true
})
export class Section {
    _id: mongoose.ObjectId;

    @Prop({ required: true, trim: true })
    sect_title: string;

    @Prop({ type: mongoose.Schema.ObjectId, ref: 'Course', required: true })
    course_id: Course;
}

export const sectionSchema = SchemaFactory.createForClass(Section);