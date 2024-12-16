import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CommentsModule } from './modules/comments/comments.module';
import { CoursesModule } from './modules/learning/modules/courses.module';
import { LessonsModule } from './modules/learning/modules/lessons.module';
import { PaymentModule } from './modules/payment/payment.module';
import { PurchasesModule } from './modules/purchases/purchases.module';
import { SectionsModule } from './modules/learning/modules/sections.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { UsersModule } from './modules/users/users.module';
import { IsUniqueConstraint } from './common/pipes/unique-field/isUniqueConstraint';
import { LearningModule } from './modules/learning/modules/learning.module';

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
