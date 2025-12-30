import { Controller, Post, Param, UseGuards } from '@nestjs/common';
import { AiAnalysisService } from './ai-analysis.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('ai-analysis')
@UseGuards(JwtAuthGuard)
export class AiAnalysisController {
    constructor(private readonly aiService: AiAnalysisService) { }

    @Post(':xrayId')
    async analyze(@Param('xrayId') xrayId: string) {
        return this.aiService.analyzeXray(xrayId);
    }
}
