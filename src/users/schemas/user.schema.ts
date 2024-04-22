import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Exclude } from "class-transformer";

@Schema({
    timestamps: true,
})
export class User {
    @Prop()
    usr_photo?: string;

    @Prop({ required: true })
    usr_username: string;

    @Prop()
    usr_firstname?: string;

    @Prop()
    usr_lastname?: string;

    @Prop({ required: true, unique: true })
    usr_email: string;

    @Prop({ required: true })
    @Exclude()
    usr_password: string;

    @Prop({ required: true, default: new Date().toISOString() })
    usr_registered_date: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

