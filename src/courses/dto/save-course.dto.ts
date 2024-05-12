import { IsNotEmpty } from "class-validator";
import { LevelEnum } from "../../utils/enum/level-enum.utils";

export class SaveCourseDto {
    @IsNotEmpty({ message: "Title is required" })
    crs_title: string;

    @IsNotEmpty({ message: "Description is required" })
    crs_description: string;

    @IsNotEmpty({ message: "Price is required" })
    crs_price: number;

    crs_new_price: number;

    @IsNotEmpty({ message: "Is paid ?" })
    crs_isPaid: boolean;

    @IsNotEmpty()
    level_id: LevelEnum;
}