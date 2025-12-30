import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorProfile } from '../users/entities/doctor-profile.entity';
import { User } from '../users/entities/user.entity';
import { PatientProfile } from '../users/entities/patient-profile.entity';
import { XRay } from '../xray/entities/xray.entity';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(DoctorProfile)
        private doctorRepo: Repository<DoctorProfile>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(PatientProfile)
        private patientRepo: Repository<PatientProfile>,
        @InjectRepository(XRay)
        private xrayRepo: Repository<XRay>,
    ) { }

    async getSystemStats() {
        const totalPatients = await this.patientRepo.count();
        const verifiedDoctors = await this.doctorRepo.count({ where: { isApproved: true } });
        const totalXrays = await this.xrayRepo.count();
        const totalAppointments = await this.userRepo.manager.count('appointment'); // Simple count

        // Get diagnosis distribution from AI reports
        const reports = await this.userRepo.manager.find('ai_report');
        const distribution = reports.reduce((acc, report: any) => {
            const pred = report.prediction || 'Unknown';
            acc[pred] = (acc[pred] || 0) + 1;
            return acc;
        }, {});

        const barData = Object.entries(distribution).map(([name, value], index) => {
            const colors = ['#10b981', '#f59e0b', '#ef4444', '#38bdf8', '#8b5cf6'];
            return { name, value, color: colors[index % colors.length] };
        });

        // Mocking some trend data for the charts (could be real if we had enough data)
        const analysisTrends = [
            { name: 'Mon', count: Math.floor(totalXrays * 0.1) },
            { name: 'Tue', count: Math.floor(totalXrays * 0.15) },
            { name: 'Wed', count: Math.floor(totalXrays * 0.2) },
            { name: 'Thu', count: Math.floor(totalXrays * 0.12) },
            { name: 'Fri', count: Math.floor(totalXrays * 0.18) },
            { name: 'Sat', count: Math.floor(totalXrays * 0.25) },
            { name: 'Sun', count: Math.floor(totalXrays * 0.22) },
        ];

        return {
            totalPatients,
            verifiedDoctors,
            totalXrays,
            totalAppointments,
            aiAccuracy: "98.4%", // Placeholder for now
            analysisTrends,
            diagnosisDistribution: barData
        };
    }

    async getRecentActivity() {
        return this.xrayRepo.find({
            relations: ['patient', 'aiReport'],
            order: { uploadedAt: 'DESC' },
            take: 10
        });
    }

    async approveDoctor(doctorId: string) {
        const doctor = await this.doctorRepo.findOne({ where: { id: doctorId } });
        if (doctor) {
            doctor.isApproved = true;
            return this.doctorRepo.save(doctor);
        }
    }

    async getAllUsers() {
        return this.userRepo.find({ relations: ['patientProfile', 'doctorProfile'] });
    }
}
