import { IsNotEmpty, IsOptional } from "class-validator";

export class SaveTeacherDto {
    @IsOptional()
    @IsNotEmpty({ message: "Biography is required" })
    tchr_biography: string;

    @IsOptional()
    @IsNotEmpty({ message: "Domain is required" })
    tchr_domain: string;
}