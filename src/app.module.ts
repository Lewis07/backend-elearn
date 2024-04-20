import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { IsUniqueConstraint } from './validation/isUniqueConstraint';

@Module({
  imports: [AuthModule, 
            UsersModule, 
            ConfigModule.forRoot({
              isGlobal: true,
              envFilePath: '.env'
            }),
            MongooseModule.forRoot(process.env.MONGO_URI)
          ],
  controllers: [AppController],
  providers: [AppService, IsUniqueConstraint],
})
export class AppModule {}
