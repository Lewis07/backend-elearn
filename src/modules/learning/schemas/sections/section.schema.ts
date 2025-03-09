import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from '../../../../common/document/abstract.document';
import { ICourseSection } from '../../../../interfaces/sections/ICourseSection';
import { CourseSection } from './course-section.schema';

@Schema({
  collection: 'sections',
})
export class Section extends AbstractDocument {
  @Prop({ type: String, required: true, trim: true })
  sect_title: string;

  @Prop({ type: CourseSection })
  course: ICourseSection;
}

export const sectionSchema = SchemaFactory.createForClass(Section);
