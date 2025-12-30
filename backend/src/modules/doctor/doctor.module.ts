import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorService } from './doctor.service';
import { DoctorController } from './doctor.controller';
import { DoctorProfile } from '../users/entities/doctor-profile.entity';
import { User } from '../users/entities/user.entity';

import { DoctorAvailability } from './entities/doctor-availability.entity';
import { DoctorReport } from './entities/doctor-report.entity';

import { AIReport } from '../ai-analysis/entities/ai-report.entity';
import { Appointment } from '../appointment/entities/appointment.entity';
import { ExternalDoctorRequest } from './entities/external-doctor-request.entity';
import { AIFinding } from '../ai-analysis/entities/ai-finding.entity';

@Module({
    imports: [TypeOrmModule.forFeature([
        DoctorProfile, User, DoctorAvailability, DoctorReport,
        AIReport, Appointment, ExternalDoctorRequest, AIFinding
    ])],
    controllers: [DoctorController],
    providers: [DoctorService],
    exports: [DoctorService],
})
export class DoctorModule { }
