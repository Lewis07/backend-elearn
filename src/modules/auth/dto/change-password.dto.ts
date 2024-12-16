import { IsNotEmpty } from 'class-validator';
import { PasswordMatch } from '../../../common/pipes/password-match/PasswordMatch';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePassword {
  @ApiProperty({ example: 'RvgtOt6sQ', description: "user's password" })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'RvgtOt6sQ',
    description: "user's confirmation of password",
  })
  @IsNotEmpty()
  @PasswordMatch('confirmPassword', {
    message: "Password doesn't match with this confirmation of password",
  })
  confirmPassword: string;
}
