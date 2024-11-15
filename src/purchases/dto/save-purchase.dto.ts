import { PaymentMethodEnum } from '../../utils/enum/payment-method-enum.utils';
import { ICourse, IUserInfo } from '../schemas/purchase.schema';

export class SavePurchaseDto {
  payment_method: PaymentMethodEnum;
  user: IUserInfo;
  purchaseItems: ICourse[];
}
