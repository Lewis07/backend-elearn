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
    async list(@Res() res: Response) {
        const courses = await this.courseService.findAll();

        return res.json({ courses });
    }

    @UseGuards(AuthGuard)
    @Get('show/:id')
    async show(@Param('id') id: string, @Res() res: Response) {
        const course = await this.courseService.findById(id);

        if (!course) {
            throw new NotFoundException("Unable to get the course, it doesn't exist"); 
        }

        return res.json({ course });
    }

    @UseGuards(AuthGuard)
    @Post('add')
    async add(@Req() req: any, @Body() createCourseDto: CreateCourseDto, @Res() res: Response) {
       const course = await this.courseService.store(req.user.id, createCourseDto);

       return res.json({ course });
    }

    @UseGuards(AuthGuard)
    @Patch('update/:id')
    async update(@Param('id') id: string, @Body() editCourseDto: EditCourseDto, @Res() res: Response) {
        const course = await this.courseService.findById(id);

        if (!course) {
            throw new NotFoundException("Unable to get the course, it doesn't exist"); 
        }

        const courseUpdate = await this.courseService.update(id, editCourseDto);

        return res.json({ course: courseUpdate });
    }

    @UseGuards(AuthGuard)
    @Delete('delete/:id')
    async delete(@Param('id') id: string, @Res() res: Response) {
        const course = await this.courseService.findById(id);

        if (!course) {
            throw new NotFoundException("Unable to delete the course, it doesn't exist"); 
        }

        await this.courseService.delete(id);

        return res.json({ courseId: course._id });
    }
}
