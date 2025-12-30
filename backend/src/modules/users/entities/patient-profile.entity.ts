import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class PatientProfile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => User, (user) => user.patientProfile)
    @JoinColumn()
    user: User;

    @Column()
    userId: string; // Foreign key for convenience

    @Column()
    fullName: string;

    @Column()
    age: number;

    @Column()
    gender: string;

    @Column({ nullable: true })
    contact: string;

    @Column({ type: 'text', nullable: true })
    medicalHistory: string;
}
