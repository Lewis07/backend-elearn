import { IsEmail, IsNotEmpty, MinLength, validate } from "class-validator";
import { IsUserEmailUnique } from "../validation/isUserEmailAlreadyExist";

export class RegisterDto {

    @IsNotEmpty({message: "Username should not be empty"})
    usr_username: string;

    usr_firstname?: string;

    usr_lastname?: string;

    @IsEmail({}, {message: 'Enter an email valid'})
    @IsNotEmpty({message: 'Email should not be empty'})
    @IsUserEmailUnique({collectionProperty: "usr_email", modelName: "userModel", collectionName: "users"}, 
                        {message: "Email is already exist in this plateform, choose another"}
                    )
    usr_email: string;

    @MinLength(8, {message: "Password should at least 8 characters"})
    @IsNotEmpty({message: "Password should not be empty"})
    usr_password: string;
}