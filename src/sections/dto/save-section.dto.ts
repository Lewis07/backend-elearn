import { IsNotEmpty } from "class-validator";
import { Course } from "../../courses/schemas/course.schema";

export class SaveSectionDto {
    @IsNotEmpty({ message: "Title is required" })
    sect_title: string;

    @IsNotEmpty({ message: 'Course is required' })
    course_id: Course;
}