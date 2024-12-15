import { ICourseContents } from './ICourseContents';

export interface ICourseContentsWithTotalSectionsLessonsDuration {
  courseContents: ICourseContents[];
  totalSections: number;
  totalLessons: number;
  totalDuration: string | number;
}
