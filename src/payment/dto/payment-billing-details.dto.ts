import { IsNotEmpty } from 'class-validator';

export class PaymentBillingDetailsDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsNotEmpty({ message: 'City is required' })
  city: string;

  @IsNotEmpty({ message: 'Address is required' })
  address_line_1: string;

  @IsNotEmpty({ message: 'Postal code is required' })
  postal_code: string;

  paymentRef: string;
}
