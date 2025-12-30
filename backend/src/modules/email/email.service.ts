import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
    private transporter: nodemailer.Transporter;
    private readonly logger = new Logger(EmailService.name);


    constructor(private configService: ConfigService) {
        this.logger.log('EMAIL_HOST = ' + this.configService.get('EMAIL_HOST'));
        this.logger.log('EMAIL_USER = ' + this.configService.get('EMAIL_USER'));

        this.transporter = nodemailer.createTransport({
            host: this.configService.get<string>('EMAIL_HOST'),
            port: this.configService.get<number>('EMAIL_PORT'),
            secure: false,
            auth: {
                user: this.configService.get<string>('EMAIL_USER'),
                pass: this.configService.get<string>('EMAIL_PASS'),
            },
        });
    }

    async sendMail(to: string, subject: string, text: string) {
        try {
            const info = await this.transporter.sendMail({
                from: this.configService.get<string>('EMAIL_FROM'),
                to,
                subject,
                text,
            });
            this.logger.log(`Email sent: ${info.messageId}`);
        } catch (error) {
            this.logger.error(`Error sending email: ${error.message}`);
            // Don't throw, just log
        }
    }
    async verify() {
        await this.transporter.verify();
        this.logger.log('SMTP server is ready to send emails');
    }

}
