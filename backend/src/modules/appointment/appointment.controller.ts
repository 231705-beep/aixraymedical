import { Controller, Post, Body, UseGuards, Request, Get, Patch, Param } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { DoctorService } from '../doctor/doctor.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AppointmentStatus } from './entities/appointment.entity';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentController {
    constructor(
        private readonly appointmentService: AppointmentService,
        private readonly doctorService: DoctorService
    ) { }

    @Post()
    @Roles(UserRole.PATIENT)
    create(@Body() createAppointmentDto: CreateAppointmentDto, @Request() req) {
        return this.appointmentService.create(createAppointmentDto, req.user.userId);
    }

    @Get('patient/:patientId')
    @Roles(UserRole.PATIENT, UserRole.ADMIN)
    findByPatient(@Param('patientId') patientId: string) {
        return this.appointmentService.findAllByPatient(patientId);
    }

    @Get('doctor/:doctorId')
    @Roles(UserRole.DOCTOR, UserRole.ADMIN)
    async findByDoctor(@Param('doctorId') doctorId: string, @Request() req) {
        // FIX: The appointment is linked to the User entity, so we must query by User ID, not Profile ID.
        return this.appointmentService.findAllByDoctor(req.user.userId);
    }

    @Patch(':id/accept')
    @Roles(UserRole.DOCTOR)
    accept(@Param('id') id: string) {
        return this.appointmentService.accept(id);
    }

    @Patch(':id/reject')
    @Roles(UserRole.DOCTOR)
    reject(@Param('id') id: string, @Body('reason') reason: string) {
        return this.appointmentService.reject(id, reason);
    }

    @Patch(':id/status')
    updateStatus(@Param('id') id: string, @Body('status') status: AppointmentStatus) {
        return this.appointmentService.updateStatus(id, status);
    }
}
