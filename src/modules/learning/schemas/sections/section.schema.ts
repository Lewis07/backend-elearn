import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { AbstractDocument } from 'src/common/document/abstract.document';
import { ICourseSections } from 'src/interfaces/sections/ICourseSections';
import { CourseSections } from './course-sections.schema';

@Schema({
  collection: 'sections',
})
export class Section extends AbstractDocument {
  @Prop({ required: true, trim: true })
  sect_title: string;

  @Prop({ type: CourseSections, required: true })
  course: ICourseSections;
}

export const sectionSchema = SchemaFactory.createForClass(Section);
