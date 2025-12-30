import { Controller, Post, Body, UseGuards, Get, Param } from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('prescriptions')
@UseGuards(JwtAuthGuard)
export class PrescriptionController {
    constructor(private readonly prescriptionService: PrescriptionService) { }

    @Post()
    create(@Body() createPrescriptionDto: CreatePrescriptionDto) {
        return this.prescriptionService.create(createPrescriptionDto);
    }

    @Get('appointment/:id')
    findByAppointment(@Param('id') id: string) {
        return this.prescriptionService.findByAppointment(id);
    }
}
