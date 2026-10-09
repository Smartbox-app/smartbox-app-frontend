import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import isEmail from 'validator/lib/isEmail';

@ValidatorConstraint({ async: false })
export class CustomEmailValidator implements ValidatorConstraintInterface {
  validate(email: unknown, _args: ValidationArguments): boolean {
    if (typeof email !== 'string') {
      return false;
    }

    const trimed = email.trim();

    return isEmail(trimed);
  }

  defaultMessage(_args: ValidationArguments) {
    return 'Invalid email address';
  }
}

export function IsCustomEmail(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: CustomEmailValidator,
    });
  };
}
