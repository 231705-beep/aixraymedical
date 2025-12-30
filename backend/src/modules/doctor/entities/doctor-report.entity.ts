import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { XRay } from '../../xray/entities/xray.entity';

@Entity()
export class DoctorReport {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    doctor: User;

    @ManyToOne(() => User)
    patient: User;

    @ManyToOne(() => XRay)
    xray: XRay;

    @Column('text')
    findings: string;

    @Column('text', { nullable: true })
    recommendations: string;
}
