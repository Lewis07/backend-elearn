import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { SectionsService } from './sections.service';
import { AuthGuard } from '../auth/auth.guard';
import { SaveSectionDto } from './dto/save-section.dto';
import { Response } from 'express';

@Controller('sections')
export class SectionsController {
    constructor( private sectionService: SectionsService ) {}

    @UseGuards(AuthGuard)
    @Get()
    async list() {
        return await this.sectionService.findAll();
    }

    @UseGuards(AuthGuard)
    @Get('show/:id')
    async show(@Param('id') id: string) {
       return await this.sectionService.findById(id);
    }

    @UseGuards(AuthGuard)
    @Post('add')
    async add(@Body() saveSectionDto: SaveSectionDto) {
      return await this.sectionService.store(saveSectionDto);
    }

    @UseGuards(AuthGuard)
    @Patch('update/:id')
    async update(@Param('id') id: string, @Body() saveSectionDto: SaveSectionDto) {
        return await this.sectionService.update(id, saveSectionDto);
    }

    @UseGuards(AuthGuard)
    @Delete('delete/:id')
    async delete(@Param('id') id: string, @Res() res: Response) {
        await this.sectionService.delete(id);

        return res.json({ sectionId: id });
    }
}
