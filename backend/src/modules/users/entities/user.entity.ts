import { Entity, PrimaryGeneratedColumn, Column, OneToOne, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { PatientProfile } from './patient-profile.entity';
import { DoctorProfile } from './doctor-profile.entity';
import { XRay } from '../../xray/entities/xray.entity';

export enum UserRole {
    PATIENT = 'PATIENT',
    DOCTOR = 'DOCTOR',
    ADMIN = 'ADMIN',
}

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    fullName: string;

    @Column()
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.PATIENT,
    })
    role: UserRole;

    @CreateDateColumn()
    createdAt: Date;

    @OneToOne(() => PatientProfile, (profile) => profile.user, { nullable: true, cascade: true })
    patientProfile: PatientProfile;

    @OneToOne(() => DoctorProfile, (profile) => profile.user, { nullable: true, cascade: true })
    doctorProfile: DoctorProfile;

    @OneToMany(() => XRay, (xray) => xray.patient)
    xrays: XRay[];
}
