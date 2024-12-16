import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.EMAIL_HOST,
          port: Number(process.env.EMAIL_PORT),
        },
        defaults: {
          from: process.env.EMAIL_FROM,
        },
      }),
    }),
  ],
})
export class SendMailModule {}
