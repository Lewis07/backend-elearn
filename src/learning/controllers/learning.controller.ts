import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { LearningService } from '../services/learning.service';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('learning')
export class LearningController {
  constructor(private learningService: LearningService) {}

  @UseGuards(AuthGuard)
  @Get()
  async getLearning(@Req() req: any) {
    return this.learningService.getLearning(req.user.id);
  }
}
