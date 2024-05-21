import { IsNotEmpty } from "class-validator";
import { Course } from "../../courses/schemas/course.schema";
import { User } from "../../users/schemas/user.schema";

export class AddCommentDto {
    @IsNotEmpty({ message: "Rating is required" })
    comm_rating: number;

    @IsNotEmpty({ message: "Content is required" })
    comm_content: string;

    author_id: User;

    @IsNotEmpty({ message: "Course is required" })
    course_id: Course;
}