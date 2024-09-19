import { IsNotEmpty } from "class-validator";
import { Lesson } from "src/lessons/schemas/lesson.schema";
import { User } from "../../users/schemas/user.schema";

export class AddCommentLessonDto {
    @IsNotEmpty({ message: "Content is required" })
    comm_content: string;

    @IsNotEmpty({ message: "Source of comment is required" })
    comm_source: string;

    author: User;
    lesson: Lesson;
}