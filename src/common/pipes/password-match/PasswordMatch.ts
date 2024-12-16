import { ValidationOptions, registerDecorator } from "class-validator";
import { PasswordMatchConstraint } from "./PasswordMatchConstraint";

export function PasswordMatch(property: string, validationOptions?: ValidationOptions) {
    return function (object: Record<string, any>, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [property],
        validator: PasswordMatchConstraint,
      });
    };
}