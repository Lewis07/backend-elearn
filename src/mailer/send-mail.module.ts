import { Module } from '@nestjs/common';
import { SendMailService } from './send-mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.EMAIL_MAILHOG_HOST,
          port: Number(process.env.EMAIL_MAILHOG_PORT)
        },
        defaults: {
          from: process.env.EMAIL_MAILHOG_FROM
        }
      })
    })
  ],
  providers: [SendMailService],
  exports: [SendMailService]
})
export class SendMailModule {}
