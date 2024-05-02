import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";

@ValidatorConstraint({ name: 'passwordMatch', async: false })
export class PasswordMatchConstraint implements ValidatorConstraintInterface {
  validate(value: any, validationArguments?: ValidationArguments): boolean {
    const [_email, password, _confirmPassword] = Object.values(validationArguments.object);

    return value === password;
  }

  defaultMessage(args: ValidationArguments) {
    const [relatedPropertyName] = args.constraints;

    return `${args.property} and ${relatedPropertyName} do not match`;
  }
}