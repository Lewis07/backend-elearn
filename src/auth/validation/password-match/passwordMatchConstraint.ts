import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'passwordMatch', async: false })
export class PasswordMatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): boolean {
    const forgotPasswordDto = {};

    for (const [key, value] of Object.entries(validationArguments.object)) {
      forgotPasswordDto[key] = value;
    }

    const { password } = Object(forgotPasswordDto);

    return value === password;
  }

  defaultMessage(args: ValidationArguments): string {
    const [relatedPropertyName] = args.constraints;

    return `${args.property} and ${relatedPropertyName} do not match`;
  }
}