import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { IsUnique } from '../../../common/pipes/unique-field/IsUnique';
import { ApiProperty } from '@nestjs/swagger';

export class Registration {
  @ApiProperty({ example: 'John', description: 'username' })
  @IsNotEmpty({ message: 'Username should not be empty' })
  @IsUnique(
    { collectionProperty: 'usr_username', collectionName: 'users' },
    { message: 'Username is already exist' },
  )
  usr_username: string;

  @ApiProperty({ example: 'john@gmail.com', description: "user's email" })
  @IsEmail({}, { message: 'Enter an email valid' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  @IsUnique(
    { collectionProperty: 'usr_email', collectionName: 'users' },
    { message: 'Email is already exist' },
  )
  usr_email: string;

  @ApiProperty({ example: 'RvgtOt6sQ', description: "user's password" })
  @MinLength(8, { message: 'Password should at least 8 characters' })
  @IsNotEmpty({ message: 'Password should not be empty' })
  usr_password: string;
}
