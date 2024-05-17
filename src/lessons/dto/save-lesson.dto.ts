import { IsNotEmpty } from "class-validator";
import { Section } from "../../sections/schemas/section.schema";

export class SaveLessonDto {
    @IsNotEmpty({ message: "Title is required" })
    lssn_title: string;

    @IsNotEmpty({ message: "Video is required" })
    lssn_video_link: string;

    @IsNotEmpty({ message: "Section is required" })
    section_id: Section;
}