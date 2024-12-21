import { Schema as MongooseSchema, Types } from 'mongoose';
import { CourseSection } from 'src/modules/learning/schemas/sections/course-section.schema';

export const SectionLessons = new MongooseSchema({
  _id: {
    type: Types.ObjectId,
  },
  course: {
    type: CourseSection,
    required: true,
  },
});
