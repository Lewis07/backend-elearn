import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { AuthGuard } from '../auth/auth.guard';
import { SavePurchaseDto } from './dto/save-purchase.dto';
import { Response } from 'express';

@Controller('purchases')
export class PurchasesController {
    constructor( private purchaseService: PurchasesService ) {}

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
    async add(@Req() req: any, @Body() savePurchaseDto: SavePurchaseDto, @Res() res: Response) {
       const purchase = await this.purchaseService.store(req.user.id, savePurchaseDto);
       const purchaseId = String(purchase._id);

       const purchaseItem = await this.purchaseService.purchaseItem(purchaseId, savePurchaseDto);

       console.log(purchase, purchaseItem);

       return res.json({ success: true });
    }

    @UseGuards(AuthGuard)
    @Patch('update/:id')
    async update(@Param('id') id: string, @Body() savePurchaseDto: SavePurchaseDto) {
        return await this.purchaseService.update(id, savePurchaseDto);
    }

    @UseGuards(AuthGuard)
    @Delete('delete/:id')
    async delete(@Param('id') id: string, @Res() res: Response) {
        await this.purchaseService.delete(id);

        return res.json({ purchaseId: id });
    }
}
