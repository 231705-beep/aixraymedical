import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { AIReport } from '../../ai-analysis/entities/ai-report.entity';

export enum XRayStatus {
    PENDING = 'PENDING',
    ANALYZED = 'ANALYZED',
    REVIEWED = 'REVIEWED',
    FAILED = 'FAILED',
}

@Entity()
export class XRay {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.xrays)
    @JoinColumn({ name: 'patientId' })
    patient: User;

    @Column()
    patientId: string;

    @Column()
    imageUrl: string;

    @Column({ nullable: true })
    originalName: string;

    @Column({
        type: 'enum',
        enum: XRayStatus,
        default: XRayStatus.PENDING,
    })
    status: XRayStatus;

    @CreateDateColumn()
    uploadedAt: Date;

    @OneToOne(() => AIReport, (report) => report.xray, { cascade: true })
    aiReport: AIReport;
}
