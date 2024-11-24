import { IsEmail, IsNotEmpty } from 'class-validator';

export class SavePaymentAddressDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Enter an email valid' })
  email: string;

  @IsNotEmpty({ message: 'City is required' })
  city: string;

  @IsNotEmpty({ message: 'Address is required' })
  address_line_1: string;

  @IsNotEmpty({ message: 'Postal code is required' })
  postal_code: string;
}
