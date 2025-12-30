import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { XRay } from './xray.entity';

@Entity()
export class XrayAnnotation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => XRay)
    xray: XRay;

    @Column('float')
    x: number;

    @Column('float')
    y: number;

    @Column('float')
    width: number;

    @Column('float')
    height: number;
}
