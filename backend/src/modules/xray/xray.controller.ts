import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Request, Get, Param, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { XrayService } from './xray.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Controller('xray')
@UseGuards(JwtAuthGuard)
export class XrayController {
    constructor(private readonly xrayService: XrayService) { }

    @Post('upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: (req: any, file: any, cb: (error: Error | null, destination: string) => void) => {
                    const uploadPath = join(process.cwd(), 'uploads');
                    cb(null, uploadPath);
                },
                filename: (req: any, file: any, callback: (error: Error | null, filename: string) => void) => {
                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname);
                    callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
                },
            }),
        }),
    )
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req) {
        if (!file) {
            throw new BadRequestException('File upload failed');
        }
        try {
            return await this.xrayService.uploadXray(file, req.user.userId);
        } catch (error) {
            console.error('Upload Controller Error:', error);
            throw new InternalServerErrorException(error.message || 'Upload processing failed');
        }
    }

    @Get('my-xrays')
    async getMyXrays(@Request() req) {
        return this.xrayService.findAllByPatient(req.user.userId);
    }

    @Get(':id')
    async getXray(@Param('id') id: string, @Request() req) {
        // SECURITY FIX: Only owner or doctor with appointment can see xray
        const xray = await this.xrayService.findOne(id);
        if (!xray) throw new BadRequestException('Xray not found');

        const isOwner = xray.patientId === req.user.userId;

        // If doctor, check if they have an appointment for this patient + report
        if (!isOwner && req.user.role === 'DOCTOR') {
            const hasAccess = await this.xrayService.verifyDoctorAccess(id, req.user.userId);
            if (!hasAccess) throw new BadRequestException('Unauthorized access to this medical record');
        } else if (!isOwner) {
            throw new BadRequestException('Unauthorized access');
        }

        return xray;
    }
}
