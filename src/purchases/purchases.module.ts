import { Module } from '@nestjs/common';
import { PurchasesService } from './purchases.service';
import { PurchasesController } from './purchases.controller';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { Purchase, PurchaseSchema } from './schemas/purchase.schema';
import { Course, CourseSchema } from '../courses/schemas/course.schema';
import { PurchaseItem, PurchaseItemSchema } from './schemas/purchase-item.schema';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => ({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
      }),
    }),
    MongooseModule.forFeature([
      { name: Purchase.name, schema: PurchaseSchema },
      { name: PurchaseItem.name, schema: PurchaseItemSchema },
      { name: Course.name, schema: CourseSchema }
    ])
  ],
  providers: [PurchasesService],
  controllers: [PurchasesController]
})
export class PurchasesModule {}
