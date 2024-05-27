import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Purchase } from './schemas/purchase.schema';
import mongoose, { Model } from 'mongoose';
import { SavePurchaseDto } from './dto/save-purchase.dto';
import { generateToken } from '../utils/generateToken.utils';
import { Course } from '../courses/schemas/course.schema';
import { PurchaseItem } from './schemas/purchase-item.schema';

interface dataPurchaseItem {
  crs_price_at_purchase: number,
  purchase_id: string,
  course_id: string
}

@Injectable()
export class PurchasesService {
  constructor(
    @InjectModel(Purchase.name) private purchaseModel: Model<Purchase>,
    @InjectModel(PurchaseItem.name) private purchaseItemModel: Model<PurchaseItem>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
  ) {}

  async findAll() {
    let purchases = await this.purchaseModel.find();
    let data = await Promise.all(purchases.map(async (purchase) => {
      const purchaseId = purchase._id;
      let purchaseItemsData = [];
      const purchaseItems = await this.purchaseItemModel.find({ purchase_id: purchaseId });

      if (purchaseItems.length > 0) {
        for (const purchaseItem of purchaseItems) {
          purchaseItemsData.push({
            _id: purchaseItem._id,
            crs_price_at_purchase: purchaseItem.crs_price_at_purchase,
            purchase_id: purchaseItem.purchase_id,
            course_id: purchaseItem.course_id
          });
        }
      }

      return {
          purch_reference: purchase.purch_reference,
          purch_firstname: purchase.purch_firstname,
          purch_lastname: purchase.purch_lastname,
          purch_zipcode: purchase.purch_zipcode,
          purch_country: purchase.purch_country,
          purch_address: purchase.purch_address,
          purch_card_number: purchase.purch_card_number,
          purch_date_at: purchase.purch_date_at,
          user_id: purchase.user_id,
          payment_method_id: purchase.payment_method_id,
          _id: purchaseId,
          purchase_items: purchaseItemsData
        }
      })
    );

    return data;
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

  async store(userId: string, addPurchase: SavePurchaseDto) {
    let data = {};
    const timestamp = Date.now().toString();
    const randomString = generateToken(8).substring(0, 7).toUpperCase();
    const purchaseReference = `${timestamp}${randomString}`;

    data = {
      ...data,
      ...addPurchase,
      purch_reference: purchaseReference,
      user_id: userId,
    };

    const purchase = await this.purchaseModel.create(data);
    const purchaseId = String(purchase._id);

    const purchaseItemsData = await this.purchaseItem(purchaseId, addPurchase);

    const purchaseWithDetail = {
      purch_reference: purchase.purch_reference,
      purch_firstname: purchase.purch_firstname,
      purch_lastname: purchase.purch_lastname,
      purch_zipcode: purchase.purch_zipcode,
      purch_country: purchase.purch_country,
      purch_address: purchase.purch_address,
      purch_card_number: purchase.purch_card_number,
      purch_date_at: purchase.purch_date_at,
      user_id: purchase.user_id,
      payment_method_id: purchase.payment_method_id,
      _id: purchase._id,
      purchaseItems: purchaseItemsData.map(item => ({
        crs_price_at_purchase: item.crs_price_at_purchase,
        purchase_id: item.purchase_id,
        course_id: item.course_id,
        _id: item._id
      }))
    };

    return purchaseWithDetail;
  }

  async update(id: string, purchase: SavePurchaseDto) {
    await this.findById(id);

    return this.purchaseModel.findByIdAndUpdate(id, purchase, { new: true });
  }

  async delete(id: string) {
    const purchase = await this.findById(id);
    const purchaseId = purchase._id;
    const purchaseItems = await this.purchaseItemModel.find({
      purchase_id: purchaseId,
    });

    if (purchaseItems.length > 0) {
      await this.purchaseItemModel.deleteMany({ purchase_id: purchaseId });
    }

    return this.purchaseModel.findByIdAndDelete(id);
  }

  async findCourseById(id: string): Promise<Course> {
    const isValidId = mongoose.isValidObjectId(id);

    if (!isValidId) {
      throw new BadRequestException('Wrong mongoose id, please enter valid id');
    }

    const course = await this.courseModel.findById(id);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async purchaseItem(purchaseId: string, savePurchaseDto: SavePurchaseDto) {
    const coursesPurchaseItems = savePurchaseDto.purchaseItems;
    let data: dataPurchaseItem[] = [];
    
    if (coursesPurchaseItems.length > 0) {
      await Promise.all(coursesPurchaseItems.map(async (course) => {
        const courseId = course.course_id;

        if (courseId) {
          const course = await this.findCourseById(courseId);
          const price = course.crs_new_price > 0 ? course.crs_new_price : course.crs_price;

          data.push({
            crs_price_at_purchase: price,
            purchase_id: purchaseId,
            course_id: courseId
          });
        }
      }));
    }

    return await this.purchaseItemModel.insertMany(data);
  }
}
