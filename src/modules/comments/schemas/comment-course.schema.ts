import { Schema as SchemaMongoose, Types } from 'mongoose';

export const CommentCourse = new SchemaMongoose({
  _id: {
    type: Types.ObjectId,
  },
  crs_title: {
    type: String,
  },
});
