import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientService } from './patient.service';
import { PatientController } from './patient.controller';
import { PatientProfile } from '../users/entities/patient-profile.entity';

import { RiskPrediction } from './entities/risk-prediction.entity';

@Module({
    imports: [TypeOrmModule.forFeature([PatientProfile, RiskPrediction])],
    controllers: [PatientController],
    providers: [PatientService],
})
export class PatientModule { }
