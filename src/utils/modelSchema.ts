import { InjectConnection, SchemaFactory } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { User } from '../users/schemas/user.schema';
import { NotFoundException } from '@nestjs/common';

export interface IModelSchema {
  generate(collectionName: string): any;
}

export function getModelByCollectionName(collectionName: string) {
  let classModel: any;

  switch (collectionName) {
    case 'users':
      classModel = User;
      break;
    default:
      throw new NotFoundException("Class model not found");
  }

  return classModel;
}

export class ModelSchema implements IModelSchema {
  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly collectionName: string,
  ) {}

  generate() {
    const modelSchema = SchemaFactory.createForClass(getModelByCollectionName(this.collectionName));
    const modelName = `${this.collectionName}Model`;

    const model = this.connection.model(
      modelName,
      modelSchema,
      this.collectionName,
    );

    return model;
  }
}
