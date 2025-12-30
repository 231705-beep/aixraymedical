import { Controller, Get, UseGuards, Request, Param, Query, Post, Body, Patch, NotFoundException } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('doctor')
@UseGuards(JwtAuthGuard)
export class DoctorController {
    constructor(private readonly doctorService: DoctorService) { }

    @Get('dashboard')
    @Roles(UserRole.DOCTOR)
    getDashboard(@Request() req) {
        return this.doctorService.getDashboardStats(req.user.userId);
    }

    @Get('reports')
    @Roles(UserRole.DOCTOR)
    getDoctorReports(@Request() req) {
        return this.doctorService.getDoctorReports(req.user.userId);
    }

    @Get('recommended/:aiReportId')
    findRecommended(@Param('aiReportId') aiReportId: string) {
        return this.doctorService.findRecommended(aiReportId);
    }

    @Get('search')
    search(@Query('q') query: string) {
        return this.doctorService.search(query);
    }

    @Get(':id/availability')
    getAvailability(@Param('id') id: string) {
        return this.doctorService.getAvailability(id);
    }

    @Post(':id/availability')
    @Roles(UserRole.DOCTOR)
    updateAvailability(@Param('id') id: string, @Body() data: any) {
        // Implementation for updating availability
        return { message: 'Availability updated' };
    }

    @Post('external-request')
    @Roles(UserRole.PATIENT)
    submitExternalRequest(@Request() req, @Body() data: any) {
        return this.doctorService.submitExternalRequest(req.user.userId, data);
    }

    @Get('all')
    findAll() {
        return this.doctorService.findAll();
    }

    @Post('seed-doctors')
    @Roles(UserRole.ADMIN)
    seedDoctors() {
        return this.doctorService.seedDoctors();
    }

    @Get('admin/pending')
    @Roles(UserRole.ADMIN)
    getPending() {
        return this.doctorService.getPendingDoctors();
    }

    @Patch('admin/:id/approve')
    @Roles(UserRole.ADMIN)
    approve(@Param('id') id: string) {
        return this.doctorService.approveDoctor(id);
    }
}
