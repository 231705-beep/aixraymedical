import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PatientProfile } from '../users/entities/patient-profile.entity';

@Injectable()
export class PatientService {
    constructor(
        @InjectRepository(PatientProfile)
        private patientProfileRepository: Repository<PatientProfile>,
    ) { }

    async findAll() {
        return this.patientProfileRepository.find({ relations: ['user'] });
    }

    async findOne(id: string) {
        return this.patientProfileRepository.findOne({ where: { id }, relations: ['user'] });
    }

    async getDashboardStats(patientId: string) {
        // Placeholder
        return {
            uploadedXrays: 5,
            upcomingAppointments: 1,
            reportsAvailable: 3
        }
    }
}
