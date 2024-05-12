import { Module } from '@nestjs/common';
import { SectionsController } from './sections.controller';
import { SectionsService } from './sections.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Section, sectionSchema } from './schemas/section.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.registerAsync({
      useFactory: async () => ({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
      }),
    }),
    MongooseModule.forFeature([{
      name: Section.name, schema: sectionSchema 
    }])
  ],
  controllers: [SectionsController],
  providers: [SectionsService]
})
export class SectionsModule {}
