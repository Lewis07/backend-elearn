import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError, useContainer } from 'class-validator';
import { FRONTEND_URL } from './utils/constant/url';
import * as express from 'express';
import * as path from 'path';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 4000;
  app.setGlobalPrefix('/api');
  app.enableCors({ origin: [FRONTEND_URL] });
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        return new BadRequestException(
          validationErrors.map((error) => ({
            field: error.property,
            error: Object.values(error.constraints)[0],
          })),
        );
      },
      stopAtFirstError: true,
    }),
  );
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use('/uploads/courses', express.static(path.resolve(__dirname, '../src/uploads/courses')));
  app.use('/uploads/lessons', express.static(path.resolve(__dirname, '../src/uploads/lessons')));

  await app.listen(port);
}

bootstrap();
