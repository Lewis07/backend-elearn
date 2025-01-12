import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from '../service/payment.service';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('payment-intent')
export class PaymentIntentController {
  constructor(private paymentService: PaymentService) {}

  @Post('create')
  async create(@Body() data: any) {
    return await this.paymentService.createPaymentIntent(data);
  }
}
