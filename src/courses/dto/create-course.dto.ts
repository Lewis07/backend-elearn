import { User } from "../../users/schemas/user.schema";
import { SaveCourseDto } from "./save-course.dto";

export class CreateCourseDto extends SaveCourseDto {
    author_id: User;
}