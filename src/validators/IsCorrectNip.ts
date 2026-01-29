import { registerDecorator, ValidationOptions, ValidationArguments } from "class-validator";
import { validateNip } from "./nip";

type CountryCodeGetter<T = any> = string | ((obj: T) => string);

export function IsNip(country: CountryCodeGetter, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "isNip",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          let countryCode: string;

          if (typeof country === "function") {
            countryCode = country(args.object);
          } else {
            countryCode = country;
          }

          return validateNip(value, countryCode);
        },
      },
    });
  };
}
