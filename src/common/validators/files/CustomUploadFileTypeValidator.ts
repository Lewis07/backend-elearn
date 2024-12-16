import { FileValidator } from "@nestjs/common";
import * as fileType from "file-type-mime";

export interface CustomUploadTypeValidatorOptions {
    fileType: string[];
}

export class CustomUploadFileTypeValidatorOptions extends FileValidator {
    private allowedMimeTypes: string[];

    constructor(protected readonly validationOptions: CustomUploadTypeValidatorOptions) {
        super(validationOptions);
        this.allowedMimeTypes = this.validationOptions.fileType;
    }

    isValid(file?: Express.Multer.File): boolean {
        const parseFileBuffer = fileType.parse(file.buffer);

        if (!parseFileBuffer || !parseFileBuffer.mime) {
            return false;
        }

        return this.allowedMimeTypes.includes(parseFileBuffer.mime);
    }

    buildErrorMessage(): string {
        return `Upload not allowed. Upload only files of type: ${this.allowedMimeTypes.join(', ')}`
    }
}