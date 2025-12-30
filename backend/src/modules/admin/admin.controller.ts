import { Controller, Get, Patch, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { RolesGuard } from '../auth/roles.guard';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
    constructor(private readonly adminService: AdminService) { }

    @Get('stats')
    @Roles(UserRole.ADMIN)
    getStats() {
        return this.adminService.getSystemStats();
    }

    @Get('activity')
    @Roles(UserRole.ADMIN)
    getActivity() {
        return this.adminService.getRecentActivity();
    }

    @Patch('approve-doctor/:id')
    @Roles(UserRole.ADMIN)
    approveDoctor(@Param('id') id: string) {
        return this.adminService.approveDoctor(id);
    }

    @Get('users')
    @Roles(UserRole.ADMIN)
    getAllUsers() {
        return this.adminService.getAllUsers();
    }
}
