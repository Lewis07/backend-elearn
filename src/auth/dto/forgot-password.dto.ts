import { IsNotEmpty } from "class-validator";
import { PasswordMatch } from "../validation/password-match/PasswordMatch";

export class ForgotPasswordDto {
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @PasswordMatch("confirmPassword", {message: "Password doesn't match with this confirmation of password"})
    confirmPassword: string;
}