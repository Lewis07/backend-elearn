import { IsNotEmpty } from "class-validator";
import { Course } from "../../courses/schemas/course.schema";
import { User } from "../../users/schemas/user.schema";
import { Lesson } from "src/lessons/schemas/lesson.schema";
import { Comment } from "../schemas/comment.schema";

export class AddCommentDto {
    @IsNotEmpty({ message: "Rating is required" })
    comm_rating: number;

    @IsNotEmpty({ message: "Content is required" })
    comm_content: string;

    @IsNotEmpty({ message: "Source of comment is required" })
    comm_source: string;

    comment_id?: Comment | null;
    author: User;
    course: Course;
    lesson: Lesson;
}