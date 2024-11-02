import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { SaveSectionDto } from './dto/save-section.dto';
import { SectionsService } from './sections.service';

@Controller('sections')
export class SectionsController {
    constructor( private sectionService: SectionsService ) {}

    @UseGuards(AuthGuard)
    @Get()
    async list() {
        return await this.sectionService.findAll();
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    async show(@Param('id') id: string) {
       return await this.sectionService.findById(id);
    }

    @UseGuards(AuthGuard)
    @Get(':id/lessons')
    async getLessons(@Param('id') id: string) {
       return await this.sectionService.getLessons(id);
    }

    @UseGuards(AuthGuard)
    @Post()
    async add(@Body() saveSectionDto: SaveSectionDto) {
      return await this.sectionService.store(saveSectionDto);
    }

    @UseGuards(AuthGuard)
    @Patch(':id')
    async update(@Param('id') id: string, @Req() req: any, @Body() saveSectionDto: SaveSectionDto) {
        return await this.sectionService.update(id, saveSectionDto, req.user.id);
    }

    @UseGuards(AuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    @Delete(':id')
    async delete(@Param('id') id: string, @Req() req: any) {
        await this.sectionService.delete(id, req.user.id);
    }

    @UseGuards(AuthGuard)
    @Get('course/:id')
    async getByCourse(@Param('id') id: string) {
        return await this.sectionService.findByCourse(id);
    }
}
