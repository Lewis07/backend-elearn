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
    @InjectModel(PurchaseItem.name) private purchaseItemModel: Model<Purchase>,
    @InjectModel(Course.name) private courseModel: Model<Course>,
  ) {}

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

    return await this.purchaseModel.create(data);
  }

  async update(id: string, purchase: SavePurchaseDto) {
    await this.findById(id);

    return this.purchaseModel.findByIdAndUpdate(id, purchase, { new: true });
  }

  async delete(id: string) {
    await this.findById(id);

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
                    const foundCourse = await this.findCourseById(courseId);
                    const price = foundCourse.crs_new_price > 0 ? foundCourse.crs_new_price : foundCourse.crs_price;

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
