import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Expose } from "class-transformer";
import mongoose, { ObjectId } from "mongoose";
import { User } from "../../users/schemas/user.schema";
import { LevelEnum } from "../../utils/enum/level-enum.utils";

@Schema({
    timestamps: true
})
export class Course {
    @Expose()
    _id: mongoose.Types.ObjectId;

    @Prop({ trim: true, required: true })
    @Expose()
    crs_title: string;

    @Prop({ trim: true, required: true })
    @Expose()
    crs_description: string;

    @Prop({ required: true })
    @Expose()
    crs_price: number;

    @Prop()
    @Expose()
    crs_new_price: number;

    @Prop({ default: false })
    @Expose()
    crs_isPaid: boolean;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    @Expose()
    author_id: User;

    @Prop({ type: String, enum: LevelEnum})
    @Expose()
    level_id: LevelEnum;
}

export const CourseSchema = SchemaFactory.createForClass(Course);