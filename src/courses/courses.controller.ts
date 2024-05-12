import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { EditCourseDto } from './dto/edit-course.dto';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';

@Controller('courses')
export class CoursesController {
    constructor( private courseService: CoursesService ) {}

    @UseGuards(AuthGuard)
    @Get('list')
    async list() {
        return await this.courseService.findAll();
    }

    @UseGuards(AuthGuard)
    @Get('show/:id')
    async show(@Param('id') id: string) {
       return await this.courseService.findById(id);
    }

    @UseGuards(AuthGuard)
    @Post('add')
    async add(@Req() req: any, @Body() createCourseDto: CreateCourseDto) {
       return await this.courseService.store(req.user.id, createCourseDto);
    }

    @UseGuards(AuthGuard)
    @Patch('update/:id')
    async update(@Param('id') id: string, @Body() editCourseDto: EditCourseDto) {
        return await this.courseService.update(id, editCourseDto);
    }

    @UseGuards(AuthGuard)
    @Delete('delete/:id')
    async delete(@Param('id') id: string, @Res() res: Response) {
        await this.courseService.delete(id);

        return res.json({ courseId: id });
    }
}
