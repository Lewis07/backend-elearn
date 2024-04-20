import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { IsUniqueConstraintInput } from "./isUnique";
import { User, UserSchema } from "../users/schemas/user.schema";
import { createModel } from "../utils/createModel.utils";
import mongoose from "mongoose";

@ValidatorConstraint({name: 'IsUniqueConstraint', async: true})
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
    async validate(value: any, validationArguments?: ValidationArguments): Promise<boolean> {
        const {modelName, property}: IsUniqueConstraintInput = validationArguments.constraints[0];
        const model = createModel(modelName, UserSchema);

        console.log(model);

        const existingData = await model.findOne({ property: value }).exec();
        console.log(existingData);

        // console.log(validationArguments);

        return false;
        // return isExist ? false : true;
    }

    defaultMessage?(validationArguments?: ValidationArguments): string {
        const field: string = validationArguments.property;

        return `${field} is already exist`;
    }
}

