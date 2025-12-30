import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { PatientService } from './patient.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@Controller('patient')
@UseGuards(JwtAuthGuard)
export class PatientController {
    constructor(private readonly patientService: PatientService) { }

    @Get('dashboard')
    @Roles(UserRole.PATIENT)
    getDashboard(@Request() req) {
        return this.patientService.getDashboardStats(req.user.userId);
    }
}
