import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/user.schema';
import { UserReset, UserResetSchema } from './schemas/user-reset.schema';

@Module({
  imports: [MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: UserReset.name, schema: UserResetSchema }
    ])
  ],
  providers: [UsersService],
  exports: [UsersService]
})

export class UsersModule {}
