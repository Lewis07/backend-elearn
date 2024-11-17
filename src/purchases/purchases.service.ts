import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { generateToken } from '../utils/generateToken.utils';
import { SavePurchaseDto } from './dto/save-purchase.dto';
import { Purchase } from './schemas/purchase.schema';

@Injectable()
export class PurchasesService {
  constructor(
    @InjectModel(Purchase.name) private purchaseModel: Model<Purchase>,
  ) {}

  async findAll() {
    return await this.purchaseModel.find();
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

  async store(purchase: SavePurchaseDto) {
    const timestamp = Date.now().toString();
    const randomString = generateToken(8).substring(0, 7).toUpperCase();
    const purchaseReference = `${timestamp}${randomString}`;
    const data = {
      ...purchase,
      purch_reference: purchaseReference,
    };

    try {
      return await this.purchaseModel.create(data);
    } catch (error) {
      console.error('Error saving purchase:', error);
      throw error;
    }
  }
}
