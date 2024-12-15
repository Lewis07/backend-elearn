import { ISaveLesson } from './ISaveLesson';
import { ISectionLessons } from './ISectionLessons';

export interface IAddLesson extends ISaveLesson {
  section: ISectionLessons;
}
