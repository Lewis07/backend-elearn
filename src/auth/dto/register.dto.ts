import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { IsUnique } from "../../validation/isUnique";

export class RegisterDto {

    @IsNotEmpty({message: "Username should not be empty"})
    usr_username: string;

    usr_firstname?: string;

    usr_lastname?: string;

    @IsEmail({}, {message: 'Enter an email valid'})
    @IsNotEmpty({message: 'Email should not be empty'})
    // @IsUnique({modelName: 'users', property: "usr_email"})
    usr_email: string;

    @MinLength(8, {message: "Password should at least 8 characters"})
    @IsNotEmpty({message: "Password should not be empty"})
    usr_password: string;
}