import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsNumber, MinLength } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    password: string;

    @IsEnum(UserRole)
    role: UserRole;

    @IsNotEmpty()
    @IsString()
    fullName: string;

    // Patient Fields
    @IsOptional()
    @IsNumber()
    age?: number;

    @IsOptional()
    @IsString()
    gender?: string;

    @IsOptional()
    @IsString()
    contact?: string;

    @IsOptional()
    @IsString()
    phoneNumber?: string;

    @IsOptional()
    @IsString()
    medicalHistory?: string;

    // Doctor Fields
    @IsOptional()
    @IsString()
    specialization?: string;

    @IsOptional()
    @IsString()
    licenseNumber?: string;

    @IsOptional()
    @IsString()
    experience?: string;

    @IsOptional()
    @IsString()
    hospital?: string;
}
