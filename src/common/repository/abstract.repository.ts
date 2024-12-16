import { Logger, NotFoundException } from '@nestjs/common';
import { FilterQuery, Model, Types, UpdateQuery } from 'mongoose';
import { uppercaseFirstLetter } from 'src/utils/string/uppercaseFirstLetter';
import { AbstractDocument } from '../document/abstract.document';

export abstract class AbstractRepository<TDocument extends AbstractDocument> {
  protected abstract readonly logger: Logger;

  constructor(protected readonly model: Model<TDocument>) {}

  async find(filterQuery?: FilterQuery<TDocument>): Promise<TDocument[]> {
    return await this.model.find(filterQuery).sort({ createdAt: -1 });
  }

  async findById(id: Types.ObjectId): Promise<TDocument> {
    const document = await this.model.findById(id);

    if (!document) {
      throw new NotFoundException(`${this.model.modelName} not found`);
    }

    this.logger.log(
      `Document ${uppercaseFirstLetter(this.model.modelName)} with id ${document.toJSON()._id}, ${document}`,
    );
    return document;
  }

  async findOne(filterQuery: FilterQuery<TDocument>): Promise<TDocument> {
    const document = await this.model.findOne(filterQuery);

    if (!document) {
      throw new NotFoundException(`${this.model.modelName} not found`);
    } else {
      this.logger.log(
        `Document ${uppercaseFirstLetter(this.model.modelName)} with id ${document.toJSON()._id}, ${document}`,
      );
    }

    return document;
  }

  async create(document: Partial<TDocument>): Promise<TDocument> {
    const documentToCreate = new this.model({
      ...document,
      _id: new Types.ObjectId(),
    });

    const createdDocument = await documentToCreate.save();

    this.logger.log(
      `Document ${uppercaseFirstLetter(this.model.modelName)} with id : ${createdDocument.toJSON()._id} saved successfully`,
    );

    return createdDocument.toJSON() as unknown as TDocument;
  }

  async findByIdAndUpdate(
    id: Types.ObjectId,
    data: UpdateQuery<TDocument>,
  ): Promise<TDocument | null> {
    const updatedDocument = await this.model.findByIdAndUpdate(id, data, {
      new: true,
    });

    this.logger.log(
      `Document ${uppercaseFirstLetter(this.model.modelName)} with id : ${updatedDocument._id} updated successfully`,
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
        new: true,
      },
    );

    this.logger.log(
      `Document ${uppercaseFirstLetter(this.model.modelName)} with id : ${updatedDocument._id} updated successfully`,
    );

    return updatedDocument as TDocument | null;
  }

  async findByIdAndDelete(id: Types.ObjectId): Promise<void> {
    this.logger.log(
      `Document ${uppercaseFirstLetter(this.model.modelName)} with id : ${id} deleted successfully`,
    );

    await this.model.findByIdAndDelete(id);
  }

  async findOneAndDelete(filterQuery: FilterQuery<TDocument>): Promise<void> {
    const document = await this.model.findOneAndDelete(filterQuery);
    this.logger.log(
      `Document ${uppercaseFirstLetter(this.model.modelName)} with id : ${document._id} deleted successfully`,
    );
  }
}
