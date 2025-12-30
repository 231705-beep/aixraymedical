import { Module, Global } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailService } from './email.service';

@Global()
@Module({
    imports: [
        ConfigModule,
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                transport: {
                    host: config.get<string>('EMAIL_HOST'),
                    port: config.get<number>('EMAIL_PORT'),
                    secure: false,
                    auth: {
                        user: config.get<string>('EMAIL_USER'),
                        pass: config.get<string>('EMAIL_PASS'),
                    },
                },
                defaults: {
                    from: config.get<string>('EMAIL_FROM'),
                },
            }),
        }),
    ],
    providers: [EmailService],
    exports: [EmailService],
})
export class EmailModule { }
