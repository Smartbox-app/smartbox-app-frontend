import { registerDecorator, ValidationOptions } from "class-validator";

import { validateCountry } from "./country";

export function IsCountry(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isCountry",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown) {
          return typeof value === "string" && validateCountry(value);
        },
      },
    });
  };
}