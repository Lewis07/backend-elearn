import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SendMailService {
    constructor(private mailerService: MailerService) {}

    async send (from: string, to: string, subject: string, html: string) {
        this.mailerService.sendMail({
            from,
            to,
            subject,
            html
        });
    }
}
