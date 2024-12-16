import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { LearningService } from '../services/learning.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiOkResponse } from '@nestjs/swagger';

@Controller('learning')
@ApiBearerAuth()
export class LearningController {
  constructor(private learningService: LearningService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'The courses purchased has been successfully retrieved.',
  })
  async getLearning(@Req() req: any) {
    return this.learningService.getLearning(req.user.id);
  }
}
