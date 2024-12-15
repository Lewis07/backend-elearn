import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Course } from '../../courses/schemas/course.schema';
import { AbstractDocument } from 'src/core/document/abstract.document';

@Schema({
  timestamps: true,
})
export class Section extends AbstractDocument {
  @Prop({ required: true, trim: true })
  sect_title: string;

  @Prop({ type: mongoose.Schema.ObjectId, ref: 'Course', required: true })
  course_id: Course;
}

export const sectionSchema = SchemaFactory.createForClass(Section);
