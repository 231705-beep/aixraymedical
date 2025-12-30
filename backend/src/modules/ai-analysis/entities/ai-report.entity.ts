import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { XRay } from '../../xray/entities/xray.entity';

export enum RiskLevel {
    LOW = 'LOW',
    MODERATE = 'MODERATE',
    HIGH = 'HIGH',
    CRITICAL = 'CRITICAL',
    UNKNOWN = 'UNKNOWN',
}

@Entity()
export class AIReport {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @OneToOne(() => XRay, (xray) => xray.aiReport)
    @JoinColumn()
    xray: XRay;

    @Column()
    xrayId: string;

    @Column({ type: 'text' })
    prediction: string; // e.g., "Pneumonia"

    @Column({ nullable: true })
    specialization: string;

    @Column({ type: 'float' })
    confidence: number;

    @Column({ type: 'text', nullable: true })
    findings: string; // Detailed findings

    @Column({
        type: 'enum',
        enum: RiskLevel,
        default: RiskLevel.LOW,
    })
    riskLevel: RiskLevel;

    @Column({ nullable: true })
    selectedSpecialization: string;

    @CreateDateColumn()
    generatedAt: Date;
}
