import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiAnalysisService } from './ai-analysis.service';
import { AiAnalysisController } from './ai-analysis.controller';
import { AIReport } from './entities/ai-report.entity';
import { XRay } from '../xray/entities/xray.entity';

import { AIFinding } from './entities/ai-finding.entity';
import { MedicalCaseReference } from './entities/medical-case-reference.entity';

@Module({
    imports: [TypeOrmModule.forFeature([AIReport, XRay, AIFinding, MedicalCaseReference])],
    controllers: [AiAnalysisController],
    providers: [AiAnalysisService],
    exports: [AiAnalysisService],
})
export class AiAnalysisModule { }
