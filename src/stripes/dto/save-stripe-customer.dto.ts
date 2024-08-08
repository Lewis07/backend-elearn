import { IsNotEmpty } from "class-validator";

export class SaveStripeCustomerDto {
    @IsNotEmpty({ message: "Email is required" })
    email: string;

    @IsNotEmpty({ message: "Name is required" })
    name: string;
}