import {
  ICourse,
  IUserInfo,
} from 'src/modules/purchases/schemas/purchase.schema';
import { PaymentMethodEnum } from 'src/utils/enums/payment-method.enum';

export interface IAddPurchase {
  purch_reference: string;
  payment_method: PaymentMethodEnum;
  user: IUserInfo;
  purchaseItems: ICourse[];
}
