import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment, AppointmentStatus, AppointmentSource } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { EmailService } from '../email/email.service';
import { DoctorAvailability } from '../doctor/entities/doctor-availability.entity';

@Injectable()
export class AppointmentService {
    constructor(
        @InjectRepository(Appointment)
        private appointmentRepository: Repository<Appointment>,
        private emailService: EmailService,
        @InjectRepository(DoctorAvailability)
        private availabilityRepository: Repository<DoctorAvailability>,
    ) { }

    async create(createAppointmentDto: CreateAppointmentDto & { source?: AppointmentSource }, patientId: string): Promise<Appointment> {
        // 1. Validate Doctor Availability Slot
        const appointmentDate = new Date(createAppointmentDto.date);
        const dayOfWeek = appointmentDate.toLocaleDateString('en-US', { weekday: 'long' });

        const slot = await this.availabilityRepository.findOne({
            where: {
                doctor: { id: createAppointmentDto.doctorId },
                dayOfWeek: dayOfWeek,
                isAvailable: true
            }
        });

        // 2. Check for Overlapping/Double Booking
        const existing = await this.appointmentRepository.findOne({
            where: {
                doctorId: createAppointmentDto.doctorId,
                date: createAppointmentDto.date,
                status: AppointmentStatus.ACCEPTED
            }
        });

        if (existing) {
            throw new BadRequestException('This time slot is already booked.');
        }

        const appointment = this.appointmentRepository.create({
            ...createAppointmentDto,
            patientId,
            status: AppointmentStatus.PENDING,
            source: createAppointmentDto.source || AppointmentSource.RECOMMENDED
        });

        const savedAppointment = await this.appointmentRepository.save(appointment);

        // Fetch patient and doctor for emails
        const fullAppointment = await this.appointmentRepository.findOne({
            where: { id: savedAppointment.id },
            relations: ['patient', 'patient.patientProfile', 'doctor', 'doctor.doctorProfile']
        });

        if (fullAppointment) {
            const doctorName = fullAppointment.doctor?.doctorProfile?.fullName || 'the specialist';
            try {
                await this.emailService.sendMail(
                    fullAppointment.patient.email,
                    'Appointment Requested',
                    `Your physical appointment with Dr. ${doctorName} is pending. Please pay onsite.`
                );
            } catch (emailErr) {
                // Email failure should not block the user from booking
            }
        }

        return savedAppointment;
    }

    async accept(id: string): Promise<Appointment> {
        const appointment = await this.appointmentRepository.findOne({
            where: { id },
            relations: ['patient', 'doctor']
        });
        if (!appointment) throw new NotFoundException('Appointment not found');

        appointment.status = AppointmentStatus.ACCEPTED;
        const saved = await this.appointmentRepository.save(appointment);

        await this.emailService.sendMail(
            appointment.patient.email,
            'Appointment Accepted',
            `Your appointment with Dr. ${appointment.doctor.email} has been accepted.`
        );

        return saved;
    }

    async reject(id: string, reason: string): Promise<Appointment> {
        const appointment = await this.appointmentRepository.findOne({
            where: { id },
            relations: ['patient', 'doctor']
        });
        if (!appointment) throw new NotFoundException('Appointment not found');

        appointment.status = AppointmentStatus.REJECTED;
        appointment.rejectionReason = reason;
        const saved = await this.appointmentRepository.save(appointment);

        await this.emailService.sendMail(
            appointment.patient.email,
            'Appointment Rejected',
            `Your appointment with Dr. ${appointment.doctor.email} was rejected. Reason: ${reason}`
        );

        return saved;
    }

    async findAllByPatient(patientId: string): Promise<Appointment[]> {
        return this.appointmentRepository.find({
            where: { patientId },
            relations: ['doctor', 'doctor.doctorProfile'],
            order: { date: 'DESC' },
        });
    }

    async findAllByDoctor(doctorId: string): Promise<Appointment[]> {
        return this.appointmentRepository.find({
            where: { doctorId },
            relations: ['patient', 'patient.patientProfile'],
            order: { date: 'ASC' },
        });
    }

    async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
        const appointment = await this.appointmentRepository.findOne({ where: { id } });
        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }
        appointment.status = status;
        return this.appointmentRepository.save(appointment);
    }
}
