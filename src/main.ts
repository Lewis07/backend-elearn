import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ValidationError, useContainer } from 'class-validator';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { FRONTEND_URL } from './utils/constants/urls/url';
import * as express from 'express';
import * as path from 'path';
import { Request, Response, NextFunction } from 'express';

export const LOGO = process.env.API_URL + '/assets/img/elearn-light.png';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 4000;

  app.setGlobalPrefix('/api');
  app.enableCors({ origin: [process.env.FRONTEND_URL] });
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

  const config = new DocumentBuilder()
    .setTitle('Elearned')
    .setDescription('Elearned API Description')
    .setVersion('1.0')
    .addTag('elearned.api')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  app.use(
    '/uploads/courses',
    express.static(path.resolve(__dirname, '../src/uploads/courses')),
  );
  app.use(
    '/uploads/lessons/photos',
    express.static(path.resolve(__dirname, '../src/uploads/lessons/photos')),
  );
  app.use(
    '/uploads/lessons/videos',
    express.static(path.resolve(__dirname, '../src/uploads/lessons/videos')),
  );
  app.use(
    '/assets/img/elearn-light.png',
    express.static(
      path.resolve(__dirname, '../src/assets/img/elearn-light.png'),
    ),
  );

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/') {
      return res.redirect('/api');
    }
    next();
  });

  await app.listen(port);
}

bootstrap();
