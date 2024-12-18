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
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { CommentEnum } from 'src/utils/enums/comment.enum';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CommentsService } from './comments.service';
import { AddCommentCourse } from './dto/add-comment-course.dto';
import { AddCommentLesson } from './dto/add-comment-lesson.dto';
import { EditCommentCourse } from './dto/edit-comment-course.dto';
import { EditCommentLesson } from './dto/edit-comment-lesson.dto';
import { Comment } from './schemas/comment.schema';

@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Get()
  @ApiOkResponse({
    description: 'The comments have been successfully retrieved.',
  })
  async list(): Promise<Comment[]> {
    return await this.commentsService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'The comment have been successfully retrieved.',
  })
  @ApiNotFoundResponse({
    description: 'The comment is not found.',
  })
  async show(@Param('id') id: string): Promise<Comment> {
    return await this.commentsService.findById(id);
  }

  @Get('by/course/:courseId')
  @ApiOkResponse({
    description: 'The comments by course have been successfully retrieved.',
  })
  async findByCourse(@Param('courseId') courseId: string) {
    return await this.commentsService.findByCourse(courseId);
  }

  @Get('by/lesson/:lessonId')
  @ApiOkResponse({
    description: 'The comments by lesson have been successfully retrieved.',
  })
  async findByLesson(@Param('lessonId') lessonId: string) {
    return await this.commentsService.findByLesson(lessonId);
  }

  @Post('course')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    description: 'The comment of a course has been successfully created.',
  })
  async addCourse(@Req() req: any, @Body() addCommentCourse: AddCommentCourse) {
    return await this.commentsService.store(
      req.user.id,
      addCommentCourse,
      CommentEnum.COURSE,
    );
  }

  @Post('lesson')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    description: 'The comment of a lesson has been successfully created.',
  })
  async addLesson(@Req() req: any, @Body() addCommentLesson: AddCommentLesson) {
    return await this.commentsService.store(
      req.user.id,
      addCommentLesson,
      CommentEnum.LESSON,
    );
  }

  @Patch('course/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'The comment has been successfully updated.',
  })
  @ApiNotFoundResponse({
    description: 'The comment is not found.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request.',
  })
  @ApiForbiddenResponse({
    description: 'You are not authorized to update the comment.',
  })
  async updateCourse(
    @Param('id') id: string,
    @Body() editCommentDto: EditCommentCourse,
  ) {
    return await this.commentsService.update(id, editCommentDto);
  }

  @Patch('lesson/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'The comment has been successfully updated.',
  })
  @ApiNotFoundResponse({
    description: 'The comment is not found.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request.',
  })
  @ApiForbiddenResponse({
    description: 'You are not authorized to update the comment.',
  })
  async update(
    @Param('id') id: string,
    @Body() editCommentDto: EditCommentLesson,
  ) {
    return await this.commentsService.update(id, editCommentDto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'The comment have been successfully deleted.',
  })
  async delete(@Req() req: any, @Param('id') id: string) {
    return await this.commentsService.delete(id, req.user.id);
  }

  @Patch('like/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'The comment has been successfully liked.',
  })
  async like(@Param('id') id: string, @Req() req: any) {
    return await this.commentsService.like(id, req.user.id);
  }

  @Patch('dislike/:id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'The comment has been successfully disliked.',
  })
  async dislike(@Param('id') id: string, @Req() req: any) {
    return await this.commentsService.dislike(id, req.user.id);
  }
}
