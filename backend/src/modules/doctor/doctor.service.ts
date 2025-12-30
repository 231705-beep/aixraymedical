import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DoctorProfile } from '../users/entities/doctor-profile.entity';
import { User, UserRole } from '../users/entities/user.entity';
import { AIReport } from '../ai-analysis/entities/ai-report.entity';
import { DoctorAvailability } from './entities/doctor-availability.entity';
import { ExternalDoctorRequest } from './entities/external-doctor-request.entity';
import { AIFinding } from '../ai-analysis/entities/ai-finding.entity';
import { Appointment, AppointmentStatus } from '../appointment/entities/appointment.entity';

@Injectable()
export class DoctorService implements OnModuleInit {
    async onModuleInit() {
        const count = await this.doctorProfileRepository.count();
        if (count === 0) {
            console.log('No doctors found. Seeding initial data...');
            await this.seedDoctors();
        }
    }

    constructor(
        @InjectRepository(DoctorProfile)
        private doctorProfileRepository: Repository<DoctorProfile>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(AIReport)
        private aiReportRepository: Repository<AIReport>,
        @InjectRepository(Appointment)
        private appointmentRepository: Repository<Appointment>,
        @InjectRepository(DoctorAvailability)
        private availabilityRepository: Repository<DoctorAvailability>,
        @InjectRepository(ExternalDoctorRequest)
        private externalRequestRepository: Repository<ExternalDoctorRequest>,
        @InjectRepository(AIFinding)
        private aiFindingRepository: Repository<AIFinding>,
    ) { }

    private readonly specializationMapping = {
        'pneumonia': 'Pulmonology (Thorax)',
        'infection': 'Pulmonology (Thorax)',
        'lung opacity': 'Pulmonology (Thorax)',
        'tuberculosis': 'Pulmonology (Thorax)',
        'cardiomegaly': 'Cardiology',
        'tumor': 'Oncology',
        'mass': 'Oncology',
        'fracture': 'Orthopedics',
        'dislocation': 'Orthopedics',
    };

    async extractKeywordsAndMap(reportId: string) {
        const report = await this.aiReportRepository.findOne({ where: { id: reportId } });
        if (!report) return null;

        // Simulate extraction from findings/prediction
        const keywords: { label: string, confidence: number }[] = [];
        const text = (report.prediction + ' ' + (report.findings || '')).toLowerCase();

        for (const [key, spec] of Object.entries(this.specializationMapping)) {
            if (text.includes(key)) {
                keywords.push({ label: key, confidence: report.confidence });
            }
        }

        // Default to General Physician if no mapping found
        let specialization = 'General Physician';
        if (keywords.length > 0) {
            specialization = this.specializationMapping[keywords[0].label];
        } else if (text.includes('unclear') || text.includes('multiple')) {
            specialization = 'General Physician';
        }

        // Store keywords
        for (const kw of keywords) {
            await this.aiFindingRepository.save({
                aiReport: { id: reportId },
                label: kw.label,
                confidenceScore: kw.confidence
            });
        }

        // Store selected specialization
        report.selectedSpecialization = specialization;
        await this.aiReportRepository.save(report);

        return specialization;
    }

    async findRecommended(aiReportId: string) {
        let specialization = '';
        const report = await this.aiReportRepository.findOne({ where: { id: aiReportId } });

        if (report && report.selectedSpecialization) {
            specialization = report.selectedSpecialization;
        } else {
            specialization = await this.extractKeywordsAndMap(aiReportId) || 'General Physician';
        }

        return this.doctorProfileRepository.find({
            where: { specialization, isApproved: true },
            relations: ['user'],
            take: 5
        });
    }

    async submitExternalRequest(userId: string, data: any) {
        const request = this.externalRequestRepository.create({
            patientId: userId,
            doctorName: data.doctorName || data.doctor_name,
            hospital: data.hospital,
            specialization: data.specialization
        });
        return this.externalRequestRepository.save(request);
    }

    async search(query: string) {
        return this.doctorProfileRepository.createQueryBuilder('doctor')
            .leftJoinAndSelect('doctor.user', 'user')
            .where('doctor.isApproved = :approved', { approved: true })
            .andWhere('(doctor.fullName ILIKE :query OR user.email ILIKE :query OR doctor.id ILIKE :query)', { query: `%${query}%` })
            .getMany();
    }

    async seedDoctors() {
        const specializations = [
            'Cardiology', 'Dermatology', 'Gastroenterology', 'Neurology',
            'Pediatrics', 'Pulmonology (Thorax)', 'Nephrology', 'Family Medicine',
            'General Surgery', 'Neurosurgery', 'Orthopedics', 'Urology',
            'Anesthesiology', 'Ophthalmology', 'Obstetrics & Gynecology',
            'Psychiatry', 'Radiology', 'Pathology', 'ENT', 'Oncology'
        ];

        const hospitals = ['City Medical Center', 'Global Health Institute', 'Heritage Hospital', 'Mercy Care Clinic', 'St. Jude Medical'];
        const firstNames = ['James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
        const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];

        for (const spec of specializations.slice(0, 10)) { // Only seed 10 specializations
            for (let i = 1; i <= 1; i++) { // Only 1 doctor per spec
                const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
                const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
                const fullName = `Dr. ${firstName} ${lastName}`;
                const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@medmail.com`;
                const hospital = hospitals[Math.floor(Math.random() * hospitals.length)];

                // 1. Create User
                let user = await this.userRepository.findOne({ where: { email } });
                if (!user) {
                    const hashedPassword = await bcrypt.hash('password123', 10);
                    user = this.userRepository.create({
                        email,
                        password: hashedPassword,
                        role: UserRole.DOCTOR
                    });
                    user = await this.userRepository.save(user);
                }

                // 2. Create Profile
                let profile = await this.doctorProfileRepository.findOne({ where: { userId: user.id } });
                if (!profile) {
                    profile = this.doctorProfileRepository.create({
                        userId: user.id,
                        fullName,
                        specialization: spec,
                        hospital,
                        experience: 5 + Math.floor(Math.random() * 20),
                        isApproved: true,
                        licenseNumber: `LIC-${spec.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`
                    });
                    await this.doctorProfileRepository.save(profile);
                }

                // 3. Seed Availability (3 slots per doctor)
                const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
                const slots = [
                    { start: '09:00 AM', end: '12:00 PM' },
                    { start: '02:00 PM', end: '05:00 PM' },
                    { start: '06:00 PM', end: '09:00 PM' }
                ];

                for (let j = 0; j < 3; j++) {
                    const day = days[Math.floor(Math.random() * days.length)];
                    const slot = slots[j];

                    const existingSlot = await this.availabilityRepository.findOne({
                        where: { doctor: { id: user.id }, dayOfWeek: day, startTime: slot.start }
                    });

                    if (!existingSlot) {
                        await this.availabilityRepository.save({
                            doctor: user,
                            dayOfWeek: day,
                            startTime: slot.start,
                            endTime: slot.end,
                            isAvailable: true
                        });
                    }
                }
            }
        }
        return { message: 'Realistic seeding complete with availability slots' };
    }

    async getAvailability(doctorId: string) {
        return this.availabilityRepository.find({
            where: { doctor: { id: doctorId } }
        });
    }

    async findAll() {
        return this.doctorProfileRepository.find({
            where: { isApproved: true },
            relations: ['user']
        });
    }

    async getAll() {
        return this.doctorProfileRepository.find({ relations: ['user'] });
    }

    async findOne(id: string) {
        return this.doctorProfileRepository.findOne({ where: { id }, relations: ['user'] });
    }

    async findOneByUserId(userId: string) {
        return this.doctorProfileRepository.findOne({ where: { userId } });
    }

    async getDashboardStats(doctorId: string) {
        const totalAppointments = await this.appointmentRepository.count({ where: { doctorId } });
        const pendingAppointments = await this.appointmentRepository.count({ where: { doctorId, status: AppointmentStatus.PENDING } });

        // Count unique patients
        const appointments = await this.appointmentRepository.find({ where: { doctorId } });
        const uniquePatients = new Set(appointments.map(a => a.patientId)).size;

        return {
            totalPatients: uniquePatients,
            pendingAppointments: pendingAppointments,
            totalAppointments: totalAppointments,
            newReports: pendingAppointments // Simplified metric
        }
    }

    async getDoctorReports(userId: string) {
        // Resolve Doctor Profile ID from User ID
        const profile = await this.doctorProfileRepository.findOne({ where: { userId } });
        if (!profile) return []; // Or throw appropriate error

        // Find all patients with appointments for this doctor PROFILE
        const appointments = await this.appointmentRepository.find({
            where: { doctorId: profile.id },
            relations: ['patient', 'patient.patientProfile', 'patient.xrays', 'patient.xrays.aiReport']
        });

        // Extract reports from xrays
        const reports: any[] = [];
        const seenXrays = new Set<string>();

        console.log(`DEBUG: Found ${appointments.length} appointments for doctor profile ${profile.id}`);

        appointments.forEach(app => {
            console.log(`DEBUG: Checking App ${app.id}, Status: ${app.status}, ReportID: ${app.aiReportId}`);

            if (app.status !== AppointmentStatus.ACCEPTED) {
                console.log(`DEBUG: Skipping App ${app.id} - Not ACCEPTED`);
                return;
            }
            if (!app.aiReportId) {
                console.log(`DEBUG: Skipping App ${app.id} - No AI Report Linked`);
                return;
            }

            app.patient?.xrays?.forEach(xray => {
                const reportId = xray.aiReport?.id;
                const matches = reportId === app.aiReportId;
                console.log(`DEBUG:   Checking Xray ${xray.id} with Report ${reportId}. Match? ${matches}`);

                // PRIVACY FIX: Only show reports specifically linked to this appointment
                const matchesAppointment = xray.aiReport && xray.aiReport.id === app.aiReportId;

                // STATUS FIX: Only show report if appointment is ACCEPTED
                if (matchesAppointment && !seenXrays.has(xray.id)) {
                    console.log(`DEBUG:   >>> Adding Report ${reportId} to results`);
                    reports.push({
                        id: xray.aiReport.id,
                        xrayId: xray.id,
                        patientName: app.patient?.patientProfile?.fullName || app.patient?.email,
                        prediction: xray.aiReport.prediction,
                        confidence: xray.aiReport.confidence,
                        riskLevel: xray.aiReport.riskLevel,
                        findings: xray.aiReport.findings,
                        date: xray.uploadedAt
                    });
                    seenXrays.add(xray.id);
                }
            });
        });

        return reports;
    }

    async getPendingDoctors() {
        return this.doctorProfileRepository.find({
            where: { isApproved: false },
            relations: ['user']
        });
    }

    async approveDoctor(doctorId: string) {
        const profile = await this.doctorProfileRepository.findOne({ where: { id: doctorId } });
        if (!profile) throw new NotFoundException('Doctor profile not found');
        profile.isApproved = true;
        return this.doctorProfileRepository.save(profile);
    }
}
