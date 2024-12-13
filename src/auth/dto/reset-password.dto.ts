import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ResetPassword {
  @ApiProperty({ example: 'john@gmail.com', description: "user's email" })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;
}
