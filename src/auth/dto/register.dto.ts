import { IsEmail, IsNotEmpty, MinLength } from "class-validator";
import { IsUnique } from "../../utils/validation/unique-field/IsUnique";

export class RegisterDto {

    @IsNotEmpty({message: "Username should not be empty"})
    @IsUnique({collectionProperty: "usr_username", collectionName: "users"}, { message: "Username is already exist" })
    usr_username: string;

    usr_firstname?: string;

    usr_lastname?: string;

    @IsEmail({}, {message: 'Enter an email valid'})
    @IsNotEmpty({message: 'Email should not be empty'})
    @IsUnique({collectionProperty: "usr_email", collectionName: "users"}, { message: "Email is already exist" })
    usr_email: string;

    @MinLength(8, {message: "Password should at least 8 characters"})
    @IsNotEmpty({message: "Password should not be empty"})
    usr_password: string;
}