import { IsNotEmpty } from "class-validator";

export class SaveStripePaymentIntentDto  {
  @IsNotEmpty({ message: "Amount is required" })
  amount: number;

  @IsNotEmpty({ message: "Currency is required" })
  currency: string;

  purchase_id: string;

  @IsNotEmpty({ message: "City is required" })
  address_city: string;

  @IsNotEmpty({ message: "Country is required" })
  address_country: string;

  @IsNotEmpty({ message: "Address is required" })
  address_line1: string;

  address_line2: string;

  @IsNotEmpty({ message: "Postal code is required" })
  address_postal_code: number;

  @IsNotEmpty({ message: "Email is required" })
  email: string;
  
  name: string;

  @IsNotEmpty({ message: "Phone number is required" })
  phone: string;
}
