import { ValidationOptions, registerDecorator } from "class-validator";
import { IsUniqueConstraint } from "./isUniqueConstraint";

export type IsUniqueConstraintInput = {
    collectionProperty: string;
    collectionName: string;
}; 

export function IsUnique(options?: IsUniqueConstraintInput, validationOptions?: ValidationOptions) {
    return function(object: Object, propertyName: string) {
        return registerDecorator({
            name: 'is-unique',
            target: object.constructor,
            propertyName,
            options: validationOptions,
            constraints: [options],
            validator: IsUniqueConstraint, 
        });
    }
}