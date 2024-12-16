import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class SignIn {
  @ApiProperty({ example: 'john@gmail.com', description: "user's email" })
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsEmail({}, { message: 'Enter an email valid' })
  usr_email: string;

  @ApiProperty({ example: 'RvgtOt6sQ', description: "user's password" })
  @IsNotEmpty({ message: 'Password should not be empty' })
  @MinLength(8, { message: 'Password should at least 8 characters' })
  usr_password: string;
}
