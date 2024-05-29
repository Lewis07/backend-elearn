import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Exclude, Expose } from "class-transformer";
import { UserTypeEnum } from "../../utils/enum/user-type-enum.utils";

@Schema({
    timestamps: true,
})
export class User {
    @Prop({ trim: true})
    @Expose()
    usr_photo?: string;

    @Prop({ required: true, trim: true })
    @Expose()
    usr_username: string;

    @Prop({ trim: true})
    @Expose()
    usr_firstname?: string;

    @Prop({ trim: true})
    @Expose()
    usr_lastname?: string;

    @Prop({ required: true, unique: true, trim: true })
    @Expose()
    usr_email: string;

    @Prop({ required: true, trim: true,  minlength: 8 })
    @Exclude()
    usr_password: string;

    @Prop({ required: true, default: new Date().toISOString() })
    @Expose()
    usr_registered_date: Date;

    @Expose()
    createdAt: Date;
  
    @Expose()
    updatedAt: Date;

    @Prop({ default: UserTypeEnum.STUDENT })
    @Expose()
    usr_type: UserTypeEnum;
}

export const UserSchema = SchemaFactory.createForClass(User);

