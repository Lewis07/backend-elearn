import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  ValidateIf,
  ValidationArguments,
} from 'class-validator';
import { PaymentMethodEnum } from '../../utils/enum/payment-method-enum.utils';

interface PurchaseItem {
  course_id: string;
}

export class SavePurchaseDto {
  @ValidateIf((value) => value !== null, { message: 'Firstname is required' })
  @IsNotEmpty({ message: 'Firstname is required' })
  purch_firstname: string;

  @IsNotEmpty({ message: 'Lastname is required' })
  purch_lastname: string;

  @IsNotEmpty({ message: 'Amount is required' })
  amount: number;

  @IsNotEmpty({ message: 'Currency is required' })
  currency: string;

  @IsNotEmpty({ message: 'Payment method is required' })
  @IsEnum(PaymentMethodEnum, {
    message: (args: ValidationArguments) => {
      const value = args.value;
      const validKeys = Object.keys(PaymentMethodEnum).filter((key) =>
        isNaN(Number(key)),
      );
      return `${value} is not a valid payment method. Valid options are: ${validKeys.join(', ')}`;
    },
  })
  pay_method_id: PaymentMethodEnum;

  @IsNotEmpty({ message: 'Postal code is required' })
  purch_postal_code: number;

  @IsNotEmpty({ message: 'Country is required' })
  purch_country: string;

  @IsNotEmpty({ message: 'Address is required' })
  purch_address: string;

  @IsNotEmpty({ message: 'City is required' })
  city: string;

  @IsNotEmpty({ message: 'Phone is required' })
  phone: string;

  @IsOptional()
  purchaseItems: PurchaseItem[];
}
