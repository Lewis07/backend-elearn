import { Model, Types } from 'mongoose';
import { AbstractDocument } from '../document/abstract.document';
import { Logger } from '@nestjs/common';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async create(document: Partial<TDocument>): Promise<TDocument> {
    const documentToCreate = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });

    const createdDocument = await documentToCreate.save();

    this.logger.log(
      `Document with id : ${createdDocument.toJSON()._id} save successfully`,
    );

    return createdDocument.toJSON() as unknown as TDocument;
  }
}
