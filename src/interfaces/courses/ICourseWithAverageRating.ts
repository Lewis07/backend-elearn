import { ICourse } from './ICourse';

export interface ICourseWithAverageRating {
  course: ICourse;
  averageRating: number;
  totalCommentByCourse: number;
}
