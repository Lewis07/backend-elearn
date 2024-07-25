import { IsNotEmpty } from "class-validator";

export class ResetPasswordDto {
    @IsNotEmpty({ message: "Email should not be empty" })
    email: string;
}