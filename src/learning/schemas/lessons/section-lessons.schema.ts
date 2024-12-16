import { Schema as MongooseSchema, Types } from 'mongoose';
import { CourseSections } from 'src/learning/schemas/sections/course-sections.schema';

export const SectionLessons = new MongooseSchema({
  _id: {
    type: Types.ObjectId,
  },
  course: {
    type: CourseSections,
    required: true,
  },
});
