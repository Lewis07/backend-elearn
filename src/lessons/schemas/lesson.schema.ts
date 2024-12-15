import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Section } from '../../sections/schemas/section.schema';
import mongoose from 'mongoose';
import { AbstractDocument } from 'src/core/document/abstract.document';

@Schema({
  timestamps: true,
})
export class Lesson extends AbstractDocument {
  @Prop({ trim: true, required: true })
  lssn_title: string;

  @Prop({ trim: true, required: true })
  lssn_video_link?: string;

  @Prop({ trim: true, required: true })
  lssn_video_photo?: string;

  @Prop({ default: false })
  lssn_is_free: boolean;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Section', required: true })
  section: Section;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
