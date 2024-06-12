import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'passwordMatch', async: false })
export class PasswordMatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): boolean {
    let bodyForgotPassword = {...validationArguments.object};
    const { password } = Object(bodyForgotPassword);

    return value === password;
  }

  defaultMessage(args: ValidationArguments): string {
    const [relatedPropertyName] = args.constraints;

    return `${args.property} and ${relatedPropertyName} do not match`;
  }
}