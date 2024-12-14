import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class UpdateProfile {
  @ApiProperty({ example: 'John', description: 'username' })
  @IsNotEmpty({ message: 'Username should not be empty' })
  usr_username: string;

  @ApiProperty({ example: 'John', description: "user's firstname" })
  usr_firstname?: string;

  @ApiProperty({ example: 'Dupont', description: "user's lastname" })
  usr_lastname?: string;
}
