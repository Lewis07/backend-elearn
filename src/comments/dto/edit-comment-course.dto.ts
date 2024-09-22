import { IsNotEmpty } from "class-validator";

export class EditCommentDto {
    @IsNotEmpty({ message: "Rating is required" })
    comm_rating: number;

    @IsNotEmpty({ message: "Content is required" })
    comm_content: string;
}