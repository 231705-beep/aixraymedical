import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class AuditLog {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    action: string;

    @Column()
    entity: string;

    @Column()
    performedBy: string; // User ID or system

    @CreateDateColumn()
    createdAt: Date;
}
