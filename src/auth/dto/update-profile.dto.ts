import { IsNotEmpty } from "class-validator";

export class UpdateProfileDto {
    @IsNotEmpty({message: "Username should not be empty"})
    usr_username: string;

    usr_firstname?: string;

    usr_lastname?: string;
}