import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class RiskPrediction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User)
    patient: User;

    @Column()
    condition: string;

    @Column()
    riskLevel: string;

    @Column('float')
    probability: number;
}
