import {
  Body,
  Controller,
  Delete,
  Get,
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

@Controller('teachers')
export class TeachersController {
  constructor(private teachersService: TeachersService) {}

  @UseGuards(AuthGuard)
  @Get('list')
  async list() {
    return await this.teachersService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('show/:id')
  async show(@Param('id') id: string) {
    return await this.teachersService.findById(id);
  }

  @UseGuards(AuthGuard)
  @Post('add')
  async add(@Req() req: any, @Body() saveTeacherDto: SaveTeacherDto) {
    return await this.teachersService.store(req.user.id, saveTeacherDto);
  }

  @UseGuards(AuthGuard)
  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body() saveTeacherDto: SaveTeacherDto,
  ) {
    return await this.teachersService.update(id, saveTeacherDto);
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    await this.teachersService.delete(id);

    return res.json({ teacherId: id });
  }
}
