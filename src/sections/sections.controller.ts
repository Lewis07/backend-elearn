import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { SectionsService } from './sections.service';
import { SaveSection } from './dto/save-section.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Section } from './schemas/section.schema';

@Controller('sections')
export class SectionsController {
  constructor(private sectionService: SectionsService) {}

  @Get()
  @ApiOkResponse({
    description: 'The sections have been successfully retrieved.',
  })
  async list(): Promise<Section[]> {
    return await this.sectionService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'The section have been successfully retrieved.',
  })
  @ApiNotFoundResponse({
    description: 'The section is not found.',
  })
  async show(@Param('id') id: string) {
    return await this.sectionService.findById(id);
  }

  @Get('course/:id')
  async getByCourse(@Param('id') id: string) {
    return await this.sectionService.findByCourse(id);
  }

  @Get(':id/lessons')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getLessons(@Param('id') id: string) {
    return await this.sectionService.getLessons(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    description: 'The section has been successfully created.',
  })
  async add(@Body() saveSectionDto: SaveSection) {
    return await this.sectionService.store(saveSectionDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'The section has been successfully updated.',
  })
  @ApiNotFoundResponse({
    description: 'The section is not found.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request.',
  })
  @ApiForbiddenResponse({
    description: 'You are not authorized to update the section.',
  })
  async update(
    @Param('id') id: string,
    @Req() req: any,
    @Body() saveSectionDto: SaveSection,
  ) {
    return await this.sectionService.update(id, saveSectionDto, req.user.id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  async delete(@Param('id') id: string, @Req() req: any): Promise<void> {
    await this.sectionService.delete(id, req.user.id);
  }
}
