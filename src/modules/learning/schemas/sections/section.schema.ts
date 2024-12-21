import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/common/document/abstract.document';
import { ICourseSection } from 'src/interfaces/sections/ICourseSection';
import { CourseSection } from './course-section.schema';

@Schema({
  collection: 'sections',
})
export class Section extends AbstractDocument {
  @Prop({ required: true, trim: true })
  sect_title: string;

  @Prop({ type: CourseSection })
  course: ICourseSection;
}

export const sectionSchema = SchemaFactory.createForClass(Section);
