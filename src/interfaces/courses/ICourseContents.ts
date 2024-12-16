import { Section } from 'src/learning/schemas/sections/section.schema';
import { ILessonInSectionWithDuration } from '../lessons/ILessonInSectionWithDuration';

export interface ICourseContents {
  section: Section;
  lessons: ILessonInSectionWithDuration[];
  countLesson: number;
  countDurationInMinute: string | number;
}
