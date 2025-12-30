import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class DoctorProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, (user) => user.doctorProfile)
    @JoinColumn()
    user: User;

    @Column()
    userId: string;

    @Column()
    fullName: string;

    @Column()
    specialization: string;

    @Column()
    licenseNumber: string;

    @Column({ default: 0 })
    experience: number;

    @Column({ nullable: true })
    clinicName: string;

    @Column({ nullable: true })
    hospital: string;

    @Column({ default: false })
    isApproved: boolean;
}
