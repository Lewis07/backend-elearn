import { Schema as MongooseSchema, Types } from 'mongoose';

export const CourseSection = new MongooseSchema({
  _id: {
    type: Types.ObjectId,
  },
  author: {
    type: Types.ObjectId,
    required: true,
  },
});
