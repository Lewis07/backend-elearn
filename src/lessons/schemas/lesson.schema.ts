import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Section } from "../../sections/schemas/section.schema";
import mongoose from "mongoose";

@Schema({
    timestamps: true
})
export class Lesson {
    @Prop({ trim: true, required: true })
    lssn_title: string;

    @Prop({ trim: true, required: true })
    lssn_video_link?: string;

    @Prop({ type: mongoose.Types.ObjectId, ref: 'Section', required: true })
    section_id: Section;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);    