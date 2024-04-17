import { IsEmail, IsNotEmpty } from "class-validator";

export class RegisterDto {

    @IsNotEmpty()
    usr_username: string;

    usr_firstname?: string;

    usr_lastname?: string;

    @IsNotEmpty()
    @IsEmail()
    usr_email: string;

    @IsNotEmpty()
    usr_password: string;
}