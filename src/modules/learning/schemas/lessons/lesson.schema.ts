import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../../../common/document/abstract.document';
import { ISectionLessons } from '../../../../interfaces/lessons/ISectionLessons';
import { SectionLessons } from './section-lessons.schema';

@Schema({
  collection: 'lessons',
})
export class Lesson extends AbstractDocument {
  @Prop({ type: String, trim: true, required: true })
  lssn_title: string;

  @Prop({ type: String, trim: true, required: true })
  lssn_video_link?: string;

  @Prop({ type: String, trim: true, required: true })
  lssn_video_photo?: string;

  @Prop({ type: Boolean, default: false })
  lssn_is_free: boolean;

  @Prop({ type: SectionLessons, required: true })
  section: ISectionLessons;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
