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
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CommentsService } from './comments.service';
import { AddCommentDto } from './dto/add-comment.dto';
import { EditCommentDto } from './dto/edit-comment.dto';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  async list() {
    return await this.commentsService.findAll();
  }

  @Get(':id')
  async show(@Param('id') id: string) {
    return await this.commentsService.findById(id);
  }

  @Get('by/course/:courseId')
  async findByCourse(@Param('courseId') courseId: string) {
    return await this.commentsService.findByCourse(courseId);
  }

  @Get('by/lesson/:lessonId')
  async findByLesson(@Param('lessonId') lessonId: string) {
    return await this.commentsService.findByLesson(lessonId);
  }

  @UseGuards(AuthGuard)
  @Post()
  async add(@Req() req: any, @Body() addCommentDto: AddCommentDto) {
    return await this.commentsService.store(req.user.id, addCommentDto);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() editCommentDto: EditCommentDto) {
      return await this.commentsService.update(id, editCommentDto);
  }

  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Req() req: any, @Param('id') id: string) {
    return await this.commentsService.delete(id, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Patch('like/:id')
  async like(@Param('id') id: string, @Req() req: any) {
    return await this.commentsService.like(id, req.user.id);
  }

  @UseGuards(AuthGuard)
  @Patch('dislike/:id')
  async dislike(@Param('id') id: string, @Req() req: any) {
    return await this.commentsService.dislike(id, req.user.id);
  }
}
