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
  Res,
  UseGuards,
} from '@nestjs/common';
import { TeachersService } from './teachers.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { SaveTeacherDto } from './dto/save-teacher.dto';
import { Response } from 'express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

@Controller('teachers')
export class TeachersController {
  constructor(private teachersService: TeachersService) {}

  @Get()
  @ApiOkResponse({
    description: 'The teachers have been successfully retrieved.',
  })
  async list() {
    return await this.teachersService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'The teacher have been successfully retrieved.',
  })
  @ApiNotFoundResponse({
    description: 'The teacher is not found.',
  })
  async show(@Param('id') id: string) {
    return await this.teachersService.findById(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiCreatedResponse({
    description: 'The teacher has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request.',
  })
  async add(@Req() req: any, @Body() saveTeacherDto: SaveTeacherDto) {
    return await this.teachersService.store(req.user.id, saveTeacherDto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiOkResponse({
    description: 'The teacher has been successfully updated.',
  })
  @ApiBadRequestResponse({
    description: 'Bad request.',
  })
  async update(
    @Param('id') id: string,
    @Body() saveTeacherDto: SaveTeacherDto,
  ) {
    return await this.teachersService.update(id, saveTeacherDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @ApiNoContentResponse({
    description: 'The teacher has been successfully deleted.',
  })
  async delete(@Param('id') id: string) {
    await this.teachersService.delete(id);
  }
}
