import { registerDecorator, ValidationOptions } from "class-validator";
import { validateNip } from "./nip";

export function IsNip(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "isNip",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return validateNip(value);
        },
      },
    });
  };
}