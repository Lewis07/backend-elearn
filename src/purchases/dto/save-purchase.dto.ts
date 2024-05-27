import { IsEnum, IsNotEmpty, IsOptional, ValidationArguments } from "class-validator";
import { PaymentMethodEnum } from "../../utils/enum/payment-method-enum.utils";

interface PurchaseItem {
    course_id: string;
}

export class SavePurchaseDto {
    @IsOptional()
    @IsNotEmpty({ message: "Firstname is required" })
    purch_firstname: string;

    @IsOptional()
    @IsNotEmpty({ message: "Lastname is required" })
    purch_lastname: string;

    @IsOptional()
    @IsNotEmpty({ message: "Zipcode is required" })
    purch_zipcode: number

    @IsOptional()
    @IsNotEmpty({ message: "Country is required" })
    purch_country: string;

    @IsOptional()
    @IsNotEmpty({ message: "Address is required" })
    purch_address: string;

    @IsOptional()
    @IsNotEmpty({ message: "Card number is required" })
    purch_card_number: number;

    @IsOptional()
    @IsNotEmpty({ message: "Payment method is required" })
    @IsEnum(PaymentMethodEnum, {
        message: (args: ValidationArguments) => {
            const value = args.value;
            const validKeys = Object.keys(PaymentMethodEnum)
              .filter((key) => isNaN(Number(key)));
            return `${value} is not a valid payment method. Valid options are: ${validKeys.join(', ')}`;
        },    
    })
    payment_method_id: PaymentMethodEnum;

    @IsOptional()
    purchaseItems: PurchaseItem[];
}