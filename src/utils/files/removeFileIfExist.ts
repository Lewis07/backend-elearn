import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import { join } from 'path';

export function removeFileIfExist(pathUpload: string, filename: string): void {
  if (filename) {
    const filePath: string = join(pathUpload, filename);

    try {
      fs.unlinkSync(filePath);
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Unable to delete the file');
    }
  }
}
