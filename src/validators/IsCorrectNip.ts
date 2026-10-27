import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";

import { validateNip } from "src/validators/nip";

type CountryCodeGetter<T extends object> = string | ((obj: T) => string);

export function IsNip<T extends object>(
  country: CountryCodeGetter<T>,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isNip",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments) {
          if (typeof value !== "string") {
            return false;
          }

          const countryCode =
            typeof country === "function"
              ? country(args.object as T)
              : country;

          return validateNip(value, countryCode);
        },
      },
    });
  };
}
