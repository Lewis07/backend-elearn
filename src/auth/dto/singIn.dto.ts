import { IsNotEmpty, MinLength } from "class-validator";

export class SignInDto {
    @IsNotEmpty()
    usr_email: string;

    @IsNotEmpty()
    @MinLength(8)
    usr_password: string;
}