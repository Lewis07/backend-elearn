import { AbstractRepository } from '../../../common/repository/abstract.repository';
import { Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Section } from '../schemas/sections/section.schema';

export class SectionRepository extends AbstractRepository<Section> {
  protected logger: Logger = new Logger();

  constructor(@InjectModel(Section.name) private sectionModel: Model<Section>) {
    super(sectionModel);
  }
}
