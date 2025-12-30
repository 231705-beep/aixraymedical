import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Appointment } from '../../appointment/entities/appointment.entity';

export enum PrescriptionStatus {
    ACTIVE = 'ACTIVE',
    ARCHIVED = 'ARCHIVED',
}

@Entity()
export class Prescription {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => Appointment)
    @JoinColumn()
    appointment: Appointment;

    @Column()
    appointmentId: string;

    @CreateDateColumn()
    issuedAt: Date;
}
