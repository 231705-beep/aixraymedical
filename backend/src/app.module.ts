import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { XrayModule } from './modules/xray/xray.module';
import { AiAnalysisModule } from './modules/ai-analysis/ai-analysis.module';
import { DoctorModule } from './modules/doctor/doctor.module';
import { PatientModule } from './modules/patient/patient.module';
import { PrescriptionModule } from './modules/prescription/prescription.module';
import { AppointmentModule } from './modules/appointment/appointment.module';
import { AdminModule } from './modules/admin/admin.module';
import { EmailModule } from './modules/email/email.module';
import { NotificationModule } from './modules/notification/notification.module';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const url = configService.get<string>('DATABASE_URL');
        return {
          type: 'postgres',
          url: url,
          host: !url ? configService.get<string>('DB_HOST') : undefined,
          port: !url ? configService.get<number>('DB_PORT') : undefined,
          username: !url ? configService.get<string>('DB_USERNAME') : undefined,
          password: !url ? configService.get<string>('DB_PASSWORD') : undefined,
          database: !url ? configService.get<string>('DB_DATABASE') : undefined,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true, // Auto-create tables (Dev only)
          ssl: url ? { rejectUnauthorized: false } : false, // Required for Render DB
        };
      },
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    XrayModule,
    AiAnalysisModule,
    DoctorModule,
    PatientModule,
    AdminModule,
    AppointmentModule,
    PrescriptionModule,
    EmailModule,
    NotificationModule,
    AuditModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
