import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrescriptionService } from './prescription.service';
import { PrescriptionController } from './prescription.controller';
import { Prescription } from './entities/prescription.entity';
import { Appointment } from '../appointment/entities/appointment.entity';
import { EmailModule } from '../email/email.module';


@Module({
    imports: [
        TypeOrmModule.forFeature([Prescription, Appointment]),
        EmailModule
    ],
    controllers: [PrescriptionController],
    providers: [PrescriptionService],
})
export class PrescriptionModule { }
