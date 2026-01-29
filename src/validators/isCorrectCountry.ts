import { registerDecorator, ValidationOptions } from "class-validator";
import { validateNip } from "./nip";
import { validateCountry } from "./country";

export function IsCountry(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "isCountry",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          return validateCountry(value);
        },
      },
    });
  };
}