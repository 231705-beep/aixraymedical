import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { RiskLevel } from './ai-report.entity';

@Entity()
export class MedicalCaseReference {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    caseIdNum: number;

    @Column()
    xrayType: string;

    @Column()
    specialization: string;

    @Column()
    disease: string;

    @Column('text')
    description: string;

    @Column()
    imagePath: string;

    @Column({
        type: 'enum',
        enum: RiskLevel,
        default: RiskLevel.LOW
    })
    riskLevel: RiskLevel;
}
