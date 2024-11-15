import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { AuthGuard } from '../auth/auth.guard';
import { SavePurchaseDto } from './dto/save-purchase.dto';
import { Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { StripeService } from 'src/payment/service/stripe.service';

@Controller('purchases')
export class PurchasesController extends StripeService {
  constructor(
    private purchaseService: PurchasesService,
    private userService: UsersService,
  ) {
    super();
  }

  @UseGuards(AuthGuard)
  @Get('list')
  async list() {
    return await this.purchaseService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('show/:id')
  async show(@Param('id') id: string) {
    return await this.purchaseService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Post('add')
  async add(@Req() req: any, @Body() savePurchaseDto: SavePurchaseDto) {
    const stripeCustomer = await this.userService.findOneById(req.user.id);

    if (!stripeCustomer) {
      throw new InternalServerErrorException(
        "Error from server, You don't have registered to payment plateform",
      );
    }

    const purchase = await this.purchaseService.store(
      req.user.id,
      savePurchaseDto,
    );

    const { payment_method_id } = purchase;
    const paymentMethodId = String(payment_method_id);
    const purchaseId = String(purchase._id);

    return purchase;
  }

  @UseGuards(AuthGuard)
  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() savePurchaseDto: SavePurchaseDto,
  ) {
    return await this.purchaseService.update(id, savePurchaseDto);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    await this.purchaseService.delete(id);

    return res.json({ purchaseId: id });
  }
}
