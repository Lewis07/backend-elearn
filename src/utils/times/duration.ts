import { promises as fs } from 'fs';
import * as ffmpeg from 'fluent-ffmpeg';

export const getHourMinuteSecond = (duration: number = null): string => {
  if (duration === null) return null;

  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);

  return `${hours}:${minutes}:${seconds}`;
};

export const getHourMinute = (duration: number = null): string | number => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);

  if (hours === 0) {
    return `${minutes} min`;
  }

  if (hours !== 0 && minutes !== 0) {
    return `${hours} h ${minutes} min`;
  }

  return duration;
};

export const getMinute = (duration: number = null): string | number => {
  const minutes = Math.floor((duration % 3600) / 60);

  if (minutes !== 0) {
    return `${minutes} min`;
  }

  return duration;
};

export const getMinuteAndSecond = (
  duration: number | null = null,
): string | null => {
  if (duration === null) return null;

  const minutes = Math.floor(duration / 60);
  const seconds = Math.floor(duration % 60)
    .toString()
    .padStart(2, '0');

  return `${minutes}:${seconds}`;
};

export const getVideoDurationByBuffer = async (
  filePath: string,
): Promise<number> => {
  const buff = Buffer.alloc(100);
  const header = Buffer.from('mvhd');

  const file = await fs.open(filePath, 'r');
  const { buffer } = await file.read(buff, 0, 100, 0);

  await file.close();

  const start = buffer.indexOf(header) + 17;
  const timescale = buffer.readUInt32BE(start);
  const duration = buffer.readUInt32BE(start + 4);
  const videoDuration = duration / timescale;

  return videoDuration;
};

export const getVideoDuration = async (
  filePath: string,
): Promise<number | null> => {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err: any, metadata: any) => {
      if (err) {
        reject(err);
      } else {
        const durationInSeconds = metadata.format.duration;

        resolve(durationInSeconds || null);
      }
    });
  });
};
