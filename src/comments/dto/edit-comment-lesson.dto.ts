import { IsNotEmpty } from "class-validator";

export class EditCommentLessonDto {
    @IsNotEmpty({ message: "Content is required" })
    comm_content: string;
}