import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { AuthGuard } from '../auth/auth.guard';
import { AddCommentDto } from './dto/add-comment.dto';
import { EditCommentDto } from './dto/edit-comment.dto';
import { Response } from 'express';

@Controller('comments')
export class CommentsController {
    constructor( private commentsService: CommentsService ) {}

    @Get('list')
    async list() {
        return await this.commentsService.findAll();
    }

    @Get('show/:id')
    async show(@Param('id') id: string) {
       return await this.commentsService.findById(id);
    }

    @Get('by/:courseId')
    async findBycourse(@Param('courseId') courseId: string) {
       return await this.commentsService.findBycourse(courseId);
    }

    @UseGuards(AuthGuard)
    @Post('add')
    async add(@Req() req: any, @Body() addCommentDto: AddCommentDto) {
       return await this.commentsService.store(req.user.id, addCommentDto);
    }

    @UseGuards(AuthGuard)
    @Patch('update/:id')
    async update(@Param('id') id: string, @Body() editCommentDto: EditCommentDto) {
        return await this.commentsService.update(id, editCommentDto);
    }

    @UseGuards(AuthGuard)
    @Delete('delete/:id')
    async delete(@Param('id') id: string, @Res() res: Response) {
        await this.commentsService.delete(id);

        return res.json({ commentId: id });
    }

    @UseGuards(AuthGuard)
    @Patch('/like/:id')
    async like(@Param('id') id: string, @Req() req: any) {
        return await this.commentsService.like(id, req.user.id);
    }

    @UseGuards(AuthGuard)
    @Patch('/dislike/:id')
    async dislike(@Param('id') id: string, @Req() req: any) {
        return await this.commentsService.dislike(id, req.user.id);
    }
}
