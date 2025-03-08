import { Module } from '@nestjs/common';
import { LearningController } from '../controllers/learning.controller';
import { LearningService } from '../services/learning.service';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Purchase,
  PurchaseSchema,
} from '../../../modules/purchases/schemas/purchase.schema';
import { PurchaseRepository } from '../../../modules/purchases/repository/purchase.repository';

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
    ]),
  ],
  controllers: [LearningController],
  providers: [LearningService, PurchaseRepository],
})
export class LearningModule {}
