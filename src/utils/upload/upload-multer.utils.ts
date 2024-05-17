import { diskStorage } from "multer";
import { extname, join } from "path";
import * as fs from "fs";

export function UploadMulterInDiskStorage(destination: string) {
    return diskStorage({
        destination,
        filename: (req, file, callback) => {
            const [name] = file.originalname.split(".");
            const extension = extname(file.originalname);
            const randomName = Array(10).fill(null).map(() => (Math.round(Math.random() * 8)).toString(8)).join('');
            callback(null, `${name}-${randomName}${extension}`);
        }
    });
}

export function UploadMulter(file: Express.Multer.File, uploadPath: string) {
    const [basename] = file.originalname.split('.');
    const extension = extname(file.originalname);
    const randomName = Array(10).fill(null).map(() => (Math.round(Math.random() * 8)).toString(8)).join('');

    const filename = `${basename}-${randomName}${extension}`;
    const fullPath = join(uploadPath, filename);

    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }

    fs.writeFileSync(fullPath, file.buffer);

    return { path: fullPath, ...file, filename };
}