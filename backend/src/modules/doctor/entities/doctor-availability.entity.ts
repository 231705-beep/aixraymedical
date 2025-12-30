import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class DoctorAvailability {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    doctor: User;

    @Column()
    dayOfWeek: string;

    @Column()
    startTime: string;

    @Column()
    endTime: string;

    @Column({ default: true })
    isAvailable: boolean;
}
