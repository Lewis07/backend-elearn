import { Section } from 'src/sections/schemas/section.schema';
import { ILessonInSectionWithDuration } from '../lessons/ILessonInSectionWithDuration';

export interface ICourseContents {
  section: Section;
  lessons: ILessonInSectionWithDuration[];
  countLesson: number;
  countDurationInMinute: string | number;
}
