import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { StripeService } from 'src/modules/payment/service/stripe.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { SavePurchaseDto } from './dto/save-purchase.dto';
import { PurchasesService } from './purchases.service';

@Controller('purchases')
export class PurchasesController extends StripeService {
  constructor(private purchaseService: PurchasesService) {
    super();
  }

  @UseGuards(AuthGuard)
  @Get()
  async list() {
    return await this.purchaseService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get()
  async show(@Param('id') id: string) {
    return await this.purchaseService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Post()
  async add(@Body() savePurchaseDto: SavePurchaseDto) {
    return await this.purchaseService.store(savePurchaseDto);
  }
}
