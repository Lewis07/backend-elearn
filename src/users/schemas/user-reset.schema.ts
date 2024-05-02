import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

@Schema()
export class UserReset {
    @Prop({ required: true, trim: true })
    usr_rest_email: string;

    @Prop({ required: true, trim: true })
    usr_rest_token: string;

    @Prop({ required: true})
    usr_rest_expired_at: Date;
} 

export const UserResetSchema = SchemaFactory.createForClass(UserReset);