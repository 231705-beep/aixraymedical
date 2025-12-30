import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePrescriptionDto {
    @IsNotEmpty()
    @IsString()
    appointmentId: string;

    // Add other basic fields if needed, but removing the new ones
}
