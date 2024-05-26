import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Purchase } from './schemas/purchase.schema';
import mongoose, { Model } from 'mongoose';
import { SavePurchaseDto } from './dto/save-purchase.dto';
import { generateToken } from '../utils/generateToken.utils';

@Injectable()
export class PurchasesService {
    constructor(@InjectModel(Purchase.name) private purchaseModel: Model<Purchase>) {}

    async findAll(): Promise<Purchase[]> {
        return this.purchaseModel.find();
    }

    async findById(id: string): Promise<Purchase> {
        const isvalidId = mongoose.isValidObjectId(id);
    
        if (!isvalidId) {
          throw new BadRequestException(
            'Wrong mongoose id, please enter a valid id',
          );
        }
    
        const purchase = await this.purchaseModel.findById(id);
    
        if (!purchase) {
          throw new NotFoundException('Purchase not found');
        }
    
        return purchase;
    }

    async store(userId: string, purchase: SavePurchaseDto) {
        let data = {};
        const timestamp = Date.now().toString();
        const randomString = generateToken(8).substring(0, 7).toUpperCase();
        const purchaseReference = `${timestamp}${randomString}`;

        data = {...data, ...purchase, purch_reference: purchaseReference, user_id: userId };

        return this.purchaseModel.create(data);
    } 

    async update(id: string, purchase: SavePurchaseDto) {
        await this.findById(id);
    
        return this.purchaseModel.findByIdAndUpdate(id, purchase, { new: true });
    }

    async delete(id: string) {
        await this.findById(id);
    
        return this.purchaseModel.findByIdAndDelete(id);
    }
}
