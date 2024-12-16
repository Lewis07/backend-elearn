import internal from 'stream';
import * as ffmpeg from 'fluent-ffmpeg';

interface IVideoLink {
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

export async function getPhotoFilenameAfterVideoUpload(
  videoLink: IVideoLink,
  prefixFilename: string,
  destination: string,
): Promise<string> {
  const randomName: string = Array(10)
    .fill(null)
    .map(() => Math.round(Math.random() * 8).toString(8))
    .join('');
  const photoFilename = `${prefixFilename}-${randomName}.png`;

  await new Promise((resolve, reject) => {
    ffmpeg(videoLink.path)
      .screenshots({
        timestamps: ['00:00:01'],
        filename: photoFilename,
        folder: destination,
      })
      .on('end', resolve)
      .on('error', (err: any) => reject(`Error capturing : ${err.message}`));
  });

  return photoFilename;
}
