import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { AIReport } from './ai-report.entity';

@Entity()
export class AIFinding {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => AIReport)
    aiReport: AIReport;

    @Column()
    label: string;

    @Column('float')
    confidenceScore: number;
}
