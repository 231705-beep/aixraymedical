import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppointmentService } from './appointment.service';
import { AppointmentController } from './appointment.controller';
import { Appointment } from './entities/appointment.entity';

import { DoctorAvailability } from '../doctor/entities/doctor-availability.entity';
import { DoctorModule } from '../doctor/doctor.module';
import { PatientProfile } from '../users/entities/patient-profile.entity';
import { DoctorProfile } from '../users/entities/doctor-profile.entity';
import { EmailModule } from '../email/email.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Appointment, DoctorAvailability, PatientProfile, DoctorProfile]),
        EmailModule,
        DoctorModule
    ],
    controllers: [AppointmentController],
    providers: [AppointmentService],
    exports: [AppointmentService],
})
export class AppointmentModule {
    constructor() {
        console.log('✅ AppointmentModule Loaded');
    }
}
