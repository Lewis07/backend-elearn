import { Body, Controller, Post } from '@nestjs/common';
import { PaymentService } from '../service/payment.service';
import { SavePaymentAddressDto } from '../dto/save-payment-address.dto';
import { SavePaymentDto } from '../dto/save-payment.dto';
import { ApiExcludeEndpoint } from '@nestjs/swagger';

@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @ApiExcludeEndpoint()
  @Post('address')
  async saveAddress(@Body() savePaymentAddressDto: SavePaymentAddressDto) {
    console.log(null);
  }

  @ApiExcludeEndpoint()
  @Post('create')
  async savePaymentDetail(@Body() savePaymentDto: SavePaymentDto) {
    await this.paymentService.savePaymentInformation(savePaymentDto.purchaseId);
  }
}
