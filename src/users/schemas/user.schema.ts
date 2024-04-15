import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { IsEmail, IsNotEmpty } from "class-validator";

@Schema({
    timestamps: true,
})
export class User {
    @Prop()
    usr_photo?: string;

    @Prop({ required: true })
    @IsNotEmpty()
    usr_username: string;

    @Prop()
    usr_firstname?: string;

    @Prop()
    usr_lastname?: string;

    @Prop({ required: true })
    @IsEmail()
    @IsNotEmpty()
    usr_email: string;

    @Prop({ required: true, unique: true })
    @IsNotEmpty()
    usr_password: string;

    @Prop({ required: true, default: new Date().toISOString() })
    @IsNotEmpty()
    usr_registered_date: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);