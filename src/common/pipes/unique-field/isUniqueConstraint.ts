import { Injectable } from '@nestjs/common';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { IsUniqueConstraintInput } from './IsUnique';
import { ModelSchema } from '../../../utils/schema/modelSchema';

@ValidatorConstraint({ name: 'is-already-exist-constraint', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async validate(
    value: string,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> {
    const { collectionProperty, collectionName }: IsUniqueConstraintInput =
      validationArguments.constraints[0];

    const modelName = new ModelSchema(
      this.connection,
      collectionName,
    ).generate();

    const isExist = await modelName
      .findOne({ [collectionProperty]: value })
      .select(collectionProperty);

    return isExist ? false : true;
  }

  defaultMessage?(validationArguments?: ValidationArguments): string {
    const field: string = validationArguments.property;

    return `${field} is already exist`;
  }
}
