import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ExternalDoctorRequestStatus {
    PENDING_ADMIN_APPROVAL = 'PENDING_ADMIN_APPROVAL',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

@Entity()
export class ExternalDoctorRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'patientId' })
    patient: User;

    @Column()
    patientId: string;

    @Column()
    doctorName: string;

    @Column()
    hospital: string;

    @Column({ nullable: true })
    specialization: string;

    @Column({
        type: 'enum',
        enum: ExternalDoctorRequestStatus,
        default: ExternalDoctorRequestStatus.PENDING_ADMIN_APPROVAL,
    })
    status: ExternalDoctorRequestStatus;

    @CreateDateColumn()
    createdAt: Date;
}
