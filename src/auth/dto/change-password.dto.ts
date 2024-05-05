import { IsNotEmpty } from "class-validator";
import { PasswordMatch } from "../validation/password-match/PasswordMatch";

export class ChangePasswordDto {
    @IsNotEmpty()
    password: string;

    @IsNotEmpty()
    @PasswordMatch("confirmPassword", {message: "Password doesn't match with this confirmation of password"})
    confirmPassword: string;
}