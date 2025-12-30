import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { XrayService } from './xray.service';
import { XrayController } from './xray.controller';
import { XRay } from './entities/xray.entity';
import { User } from '../users/entities/user.entity';
import { AiAnalysisModule } from '../ai-analysis/ai-analysis.module';

import { XrayAnnotation } from './entities/xray-annotation.entity';

import { Appointment } from '../appointment/entities/appointment.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([XRay, User, XrayAnnotation, Appointment]),
        AiAnalysisModule
    ],
    controllers: [XrayController],
    providers: [XrayService],
})
export class XrayModule { }
