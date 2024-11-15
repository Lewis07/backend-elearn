import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from '../service/payment.service';
import { PaymentBillingDetailsDto } from '../dto/payment-billing-details.dto';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('create')
  async savePaymentDetail(
    @Body() paymentBillingDetailsDto: PaymentBillingDetailsDto,
  ) {
    await this.paymentService.savePaymentInformation(
      paymentBillingDetailsDto.paymentRef,
    );
  }
}
