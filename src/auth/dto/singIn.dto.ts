import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class SignInDto {
    @IsNotEmpty({ message: "Email should not be empty" })
    @IsEmail({}, { message: "Enter an email valid" })
    usr_email: string;

    @IsNotEmpty({ message: "Password should not be empty" })
    @MinLength(8, {message: "Password should at least 8 characters"})
    usr_password: string;
}