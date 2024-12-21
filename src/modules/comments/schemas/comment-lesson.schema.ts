import { Schema as SchemaMongoose, Types } from 'mongoose';

export const CommentLesson = new SchemaMongoose({
  _id: {
    type: Types.ObjectId,
  },
  lssn_title: {
    type: String,
  },
});
