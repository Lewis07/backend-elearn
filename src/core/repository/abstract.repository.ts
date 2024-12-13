import { Logger } from '@nestjs/common';
import { FilterQuery, Model, ObjectId, Types, UpdateQuery } from 'mongoose';
import { AbstractDocument } from '../document/abstract.document';

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

  async findByIdAndUpdate(
    id: Types.ObjectId,
    data: UpdateQuery<TDocument>,
  ): Promise<TDocument> {
    const updatedDocument = await this.model.findByIdAndUpdate(id, data, {
      lean: true,
      new: true,
    });

    this.logger.log(
      `Document with id : ${updatedDocument._id} updated successfully`,
    );

    return updatedDocument as TDocument | null;
  }

  async findOneAndUpdate(
    filterQuery: FilterQuery<TDocument>,
    data: UpdateQuery<TDocument>,
  ): Promise<TDocument | null> {
    const updatedDocument = await this.model.findOneAndUpdate(
      filterQuery,
      data,
      {
        lean: true,
        new: true,
      },
    );

    this.logger.log(
      `Document with id : ${updatedDocument._id} updated successfully`,
    );

    return updatedDocument as TDocument | null;
  }
}
