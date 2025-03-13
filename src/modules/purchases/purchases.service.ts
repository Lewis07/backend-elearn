import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import { SavePurchaseDto } from './dto/save-purchase.dto';
import { Purchase } from './schemas/purchase.schema';
import { PurchaseRepository } from './repository/purchase.repository';
import { IAddPurchase } from 'src/interfaces/purchases/IAddPurchase';

@Injectable()
export class PurchasesService {
  constructor(private purchaseRepository: PurchaseRepository) {}

  async findAll() {
    return await this.purchaseRepository.find();
  }

  async findById(id: string): Promise<Purchase> {
    return await this.purchaseRepository.findById(new Types.ObjectId(id));
  }

  async store(purchase: SavePurchaseDto) {
    const todayInTime = Date.now();
    const purchaseReference = `ref-${todayInTime}`;

    const data: IAddPurchase = {
      ...purchase,
      purch_reference: purchaseReference,
    };

    try {
      return await this.purchaseRepository.create(data);
    } catch (error) {
      console.error('Error saving purchase:', error);
      throw error;
    }
  }
}
