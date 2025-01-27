import { Schema as MongooseSchema, Types } from 'mongoose';

export const TeacherUserInfo = new MongooseSchema({
  _id: {
    type: Types.ObjectId,
  },
  usr_photo: {
    type: String,
  },
  usr_username: {
    type: String,
  },
  usr_firstname: {
    type: String,
  },
  usr_lastname: {
    type: String,
  },
});
