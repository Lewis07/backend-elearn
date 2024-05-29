import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { CoursesModule } from './courses/courses.module';
import { SectionsModule } from './sections/sections.module';
import { LessonsModule } from './lessons/lessons.module';
import { CommentsModule } from './comments/comments.module';
import { PurchasesModule } from './purchases/purchases.module';
import { IsUniqueConstraint } from './utils/validation/unique-field/isUniqueConstraint';
import { TeachersModule } from './teachers/teachers.module';

@Module({
  imports: [AuthModule, 
            UsersModule, 
            ConfigModule.forRoot({
              isGlobal: true,
              envFilePath: '.env'
            }),
            MongooseModule.forRoot(process.env.MONGO_URI),
            CoursesModule,
            SectionsModule,
            LessonsModule,
            CommentsModule,
            PurchasesModule,
            TeachersModule,
          ],
  controllers: [AppController],
  providers: [AppService, IsUniqueConstraint],
})
export class AppModule {}
