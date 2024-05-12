import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Section } from './schemas/section.schema';
import mongoose, { Model } from 'mongoose';
import { SaveSectionDto } from './dto/save-section.dto';

@Injectable()
export class SectionsService {
    constructor(@InjectModel(Section.name) private sectionModel: Model<Section>) {}

    async findAll() {
        return this.sectionModel.find();
    }
    
    async findById(id: string) {
        const isvalidId = mongoose.isValidObjectId(id);

        if (!isvalidId) {
            throw new BadRequestException("Wrong mongoose id, please enter a valid id");
        }

        const section = await this.sectionModel.findById(id);

        if (!section) {
            throw new NotFoundException("Section not found");
        }

        return section;
    }

    async store (section: SaveSectionDto) {
        return this.sectionModel.create(section);
    }

    async update(id: string, section: SaveSectionDto) {
        await this.findById(id);

        return this.sectionModel.findByIdAndUpdate(id, section, { new: true });
    }

    async delete(id: string) {
        await this.findById(id);

        return this.sectionModel.findByIdAndDelete(id);
    }
}
