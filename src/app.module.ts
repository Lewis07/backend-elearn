import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { CoursesModule } from './learning/modules/courses.module';
import { LessonsModule } from './learning/modules/lessons.module';
import { PaymentModule } from './payment/payment.module';
import { PurchasesModule } from './purchases/purchases.module';
import { SectionsModule } from './learning/modules/sections.module';
import { TeachersModule } from './teachers/teachers.module';
import { UsersModule } from './users/users.module';
import { IsUniqueConstraint } from './utils/validation/unique-field/isUniqueConstraint';
import { LearningModule } from './learning/modules/learning.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    CoursesModule,
    SectionsModule,
    LessonsModule,
    CommentsModule,
    PurchasesModule,
    TeachersModule,
    PaymentModule,
    LearningModule,
  ],
  controllers: [AppController],
  providers: [AppService, IsUniqueConstraint],
})
export class AppModule {}
