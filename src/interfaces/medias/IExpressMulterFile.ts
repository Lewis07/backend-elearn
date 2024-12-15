import internal from 'stream';

export interface IExpressMulterFile {
  filename: string;
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  stream: internal.Readable;
  destination: string;
  path: string;
  buffer: Buffer;
}
