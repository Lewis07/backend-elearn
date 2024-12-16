import multer, { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import slugify from 'slugify';
import { IExpressMulterFile } from 'src/interfaces/medias/IExpressMulterFile';

export function UploadMulterInDiskStorage(
  destination: string,
): multer.StorageEngine {
  return diskStorage({
    destination,
    filename: (req, file, callback) => {
      const [name] = file.originalname.split('.');
      const extension = extname(file.originalname);
      const randomName = Array(10)
        .fill(null)
        .map(() => Math.round(Math.random() * 8).toString(8))
        .join('');
      callback(null, `${name}-${randomName}${extension}`);
    },
  });
}

export function UploadMulter(
  file: Express.Multer.File,
  uploadPath: string,
): IExpressMulterFile {
  const [basename] = file.originalname.split('.');
  const extension: string = extname(file.originalname);
  const randomName: string = Array(10)
    .fill(null)
    .map(() => Math.round(Math.random() * 8).toString(8))
    .join('');

  const filename: string = slugify(`${basename}-${randomName}${extension}`);
  const fullPath: string = join(uploadPath, filename);

  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
  }

  fs.writeFileSync(fullPath, file.buffer);

  return { path: fullPath, ...file, filename };
}
