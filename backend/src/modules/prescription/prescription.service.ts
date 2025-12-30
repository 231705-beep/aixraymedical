import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prescription } from './entities/prescription.entity';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { EmailService } from '../email/email.service';
import { Appointment, AppointmentStatus } from '../appointment/entities/appointment.entity';

@Injectable()
export class PrescriptionService {
    constructor(
        @InjectRepository(Prescription)
        private prescriptionRepository: Repository<Prescription>,
        @InjectRepository(Appointment)
        private appointmentRepository: Repository<Appointment>,
        private emailService: EmailService,
    ) { }

    async create(createPrescriptionDto: CreatePrescriptionDto): Promise<Prescription> {
        // 1. Check if appointment exists
        const appointment = await this.appointmentRepository.findOne({
            where: { id: createPrescriptionDto.appointmentId },
            relations: ['patient', 'doctor', 'doctor.doctorProfile']
        });

        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }

        // 2. STRICT VALIDATION: Appointment must be COMPLETED
        if (appointment.status !== AppointmentStatus.COMPLETED) {
            throw new BadRequestException('Prescription can only be created for completed appointments');
        }

        // 3. Check if prescription already exists for this appointment
        const existing = await this.prescriptionRepository.findOne({
            where: { appointmentId: createPrescriptionDto.appointmentId }
        });

        if (existing) {
            throw new BadRequestException('Prescription already exists for this appointment');
        }

        // 4. Create prescription
        const prescription = this.prescriptionRepository.create(createPrescriptionDto);
        const savedPrescription = await this.prescriptionRepository.save(prescription);

        // 5. Send email notification to patient
        const doctorName = appointment.doctor?.doctorProfile?.fullName || appointment.doctor?.email || 'Your Doctor';
        const patientEmail = appointment.patient?.email || 'patient@example.com';

        await this.emailService.sendMail(
            patientEmail,
            'Prescription Issued',
            `Dear ${appointment.patient?.patientProfile?.fullName || 'Patient'},\n\nDr. ${doctorName} has issued your prescription. You can now view and download it from your patient portal.\n\nPlease log in to view the complete prescription details.`
        );

        return savedPrescription;
    }

    async findByAppointment(appointmentId: string): Promise<Prescription | null> {
        return this.prescriptionRepository.findOne({
            where: { appointmentId },
            relations: ['appointment', 'appointment.patient', 'appointment.doctor', 'appointment.doctor.doctorProfile']
        });
    }

    async findAllByPatient(patientId: string): Promise<Prescription[]> {
        return this.prescriptionRepository
            .createQueryBuilder('prescription')
            .leftJoinAndSelect('prescription.appointment', 'appointment')
            .leftJoinAndSelect('appointment.doctor', 'doctor')
            .leftJoinAndSelect('doctor.doctorProfile', 'doctorProfile')
            .where('appointment.patientId = :patientId', { patientId })
            .orderBy('prescription.issuedAt', 'DESC')
            .getMany();
    }

    async findOne(id: string): Promise<Prescription> {
        const prescription = await this.prescriptionRepository.findOne({
            where: { id },
            relations: ['appointment', 'appointment.patient', 'appointment.patient.patientProfile', 'appointment.doctor', 'appointment.doctor.doctorProfile']
        });

        if (!prescription) {
            throw new NotFoundException('Prescription not found');
        }

        return prescription;
    }
}
