import { IsNotEmpty, MinLength } from "class-validator";
import { LevelEnum } from "../../utils/enum/level-enum.utils";

export class SaveCourseDto {
    @IsNotEmpty({ message: "Title is required" })
    crs_title: string;

    @IsNotEmpty({ message: "Description is required" })
    crs_description: string;

    @IsNotEmpty({ message: "Price is required" })
    @MinLength(0, { message: "Price should be greater than zero" })
    crs_price: number;

    @MinLength(0, { message: "Price should be greater than zero" })
    crs_new_price?: number;

    crs_isPaid: boolean;

    crs_photo?: string;

    @IsNotEmpty()
    level_id: LevelEnum;
}