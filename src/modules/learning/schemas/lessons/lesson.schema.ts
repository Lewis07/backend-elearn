import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/common/document/abstract.document';
import { ISectionLessons } from 'src/interfaces/lessons/ISectionLessons';
import { SectionLessons } from './section-lessons.schema';

@Schema({
  collection: 'lessons',
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

  @Prop({ type: SectionLessons, required: true })
  section: ISectionLessons;
}

export const LessonSchema = SchemaFactory.createForClass(Lesson);
