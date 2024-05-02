import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { InjectConnection, SchemaFactory } from "@nestjs/mongoose";
import { UserSchema } from "../../../users/schemas/user.schema";
import { Connection } from "mongoose";
import { IsUniqueConstraintInput } from "./isUserEmailAlreadyExist";

@ValidatorConstraint({name: 'IsUserEmailAlreadyExistConstraint', async: true})
@Injectable()
export class IsUserEmailAlreadyExistConstraint implements ValidatorConstraintInterface {
    constructor(@InjectConnection() private readonly connection: Connection) {}

    async validate(value: string, validationArguments?: ValidationArguments): Promise<boolean> {
        const {collectionProperty, modelName, collectionName}: IsUniqueConstraintInput = validationArguments.constraints[0];
      
        const model = this.connection.model(modelName, UserSchema, collectionName);
        const isExist = await model.findOne({ [collectionProperty]: value }).select(collectionProperty);

        return isExist ? false : true;
    }

    defaultMessage?(validationArguments?: ValidationArguments): string {
        const field: string = validationArguments.property;

        return `${field} is already exist in this plateform, choose another`;
    }
}