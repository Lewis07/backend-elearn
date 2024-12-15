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
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { Section } from './schemas/section.schema';
import { CreateSection } from './dto/create-section.dto';
import { EditSection } from './dto/edit-section.dto';

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
  @ApiOkResponse({
    description: 'The sections have been successfully retrieved.',
  })
  async getByCourse(@Param('id') id: string) {
    return await this.sectionService.findByCourse(id);
  }

  @Get('lessons/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'The sections have been successfully retrieved.',
  })
  async getLessons(@Param('id') id: string) {
    return await this.sectionService.getLessons(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    description: 'The section has been successfully created.',
  })
  async add(@Body() createSection: CreateSection) {
    return await this.sectionService.store(createSection);
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
    @Body() editSection: EditSection,
  ) {
    return await this.sectionService.update(id, editSection, req.user.id);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(AuthGuard)
  @ApiNoContentResponse({
    description: 'The sections have been successfully deleted.',
  })
  async delete(@Param('id') id: string, @Req() req: any): Promise<void> {
    await this.sectionService.delete(id, req.user.id);
  }
}
