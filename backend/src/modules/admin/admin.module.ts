import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { DoctorProfile } from '../users/entities/doctor-profile.entity';
import { User } from '../users/entities/user.entity';
import { PatientProfile } from '../users/entities/patient-profile.entity';
import { XRay } from '../xray/entities/xray.entity';

@Module({
    imports: [TypeOrmModule.forFeature([DoctorProfile, User, PatientProfile, XRay])],
    controllers: [AdminController],
    providers: [AdminService],
})
export class AdminModule { }
