import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum AppointmentStatus {
    PENDING = 'PENDING',
    ACCEPTED = 'ACCEPTED',
    REJECTED = 'REJECTED',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

export enum ConsultationMode {
    PHYSICAL = 'PHYSICAL',
    VIRTUAL = 'VIRTUAL',
}

export enum PaymentMode {
    ONSITE = 'ONSITE',
    ONLINE = 'ONLINE',
}

export enum PaymentStatus {
    PENDING_ONSITE = 'PENDING_ONSITE',
    PAID = 'PAID',
    FAILED = 'FAILED',
}

export enum AppointmentSource {
    RECOMMENDED = 'RECOMMENDED',
    OWN_DOCTOR = 'OWN_DOCTOR',
}

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'patientId' })
    patient: User;

    @Column()
    patientId: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'doctorId' })
    doctor: User;

    @Column({ nullable: true })
    doctorId: string;

    @Column({ type: 'timestamp' })
    date: Date;

    @Column({ nullable: true })
    aiReportId: string;

    @Column({
        type: 'enum',
        enum: ConsultationMode,
        default: ConsultationMode.PHYSICAL,
    })
    consultationMode: ConsultationMode;

    @Column({
        type: 'enum',
        enum: PaymentMode,
        default: PaymentMode.ONSITE,
    })
    paymentMode: PaymentMode;

    @Column({
        type: 'enum',
        enum: PaymentStatus,
        default: PaymentStatus.PENDING_ONSITE,
    })
    paymentStatus: PaymentStatus;

    @Column({
        type: 'enum',
        enum: AppointmentStatus,
        default: AppointmentStatus.PENDING,
    })
    status: AppointmentStatus;

    @Column({ type: 'text', nullable: true })
    rejectionReason: string;

    @Column({
        type: 'enum',
        enum: AppointmentSource,
        default: AppointmentSource.RECOMMENDED,
    })
    source: AppointmentSource;
}
