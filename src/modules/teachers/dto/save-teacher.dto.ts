import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SaveTeacherDto {
  @ApiProperty({
    example:
      'Lorem ipsum dolor sit amet consectetur adipiscing elit sagittis, at sollicitudin odio tristique fusce suscipit pretium vehicula, velit duis cubilia maecenas',
    description: "Teacher's biography",
  })
  @IsNotEmpty({ message: 'Biography is required' })
  tchr_biography: string;

  @ApiProperty({
    example: 'Software ingeneer',
    description: "Teacher's domain",
  })
  @IsNotEmpty({ message: 'Domain is required' })
  tchr_domain: string;
}
