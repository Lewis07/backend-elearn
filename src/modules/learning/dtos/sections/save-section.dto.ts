import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SaveSection {
  @ApiProperty({ example: 'Introduction', description: 'Section Title' })
  @IsNotEmpty({ message: 'Title is required' })
  sect_title: string;
}
