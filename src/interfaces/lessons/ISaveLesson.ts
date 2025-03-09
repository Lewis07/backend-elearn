export interface ISaveLesson {
  lssn_title: string;
  lssn_video_link: string;
  lssn_video_photo: string;
  file: Express.Multer.File;
}
