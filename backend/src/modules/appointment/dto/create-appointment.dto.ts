import { IsNotEmpty, IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { ConsultationMode, PaymentMode } from '../entities/appointment.entity';

export class CreateAppointmentDto {
    @IsNotEmpty()
    @IsString()
    doctorId: string;

    @IsNotEmpty()
    @IsDateString()
    date: Date;

    @IsString()
    @IsOptional()
    aiReportId?: string;

    @IsEnum(ConsultationMode)
    @IsOptional()
    consultationMode?: ConsultationMode;

    @IsEnum(PaymentMode)
    @IsOptional()
    paymentMode?: PaymentMode;

    @IsString()
    @IsOptional()
    notes?: string;
}
