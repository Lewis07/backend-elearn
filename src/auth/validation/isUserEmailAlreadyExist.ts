import { ValidationOptions, registerDecorator } from "class-validator";
import { IsUserEmailAlreadyExistConstraint } from "./isUserEmailAlreadyExistConstraint";

export type IsUniqueConstraintInput = {
    modelName: string;
    collectionProperty: string;
    collectionName: string;
}; 

export function IsUserEmailUnique(options?: IsUniqueConstraintInput, validationOptions?: ValidationOptions) {
    return function(object: Object, propertyName: string) {
        return registerDecorator({
            name: 'is-unique',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [options],
            validator: IsUserEmailAlreadyExistConstraint, 
        });
    }
}