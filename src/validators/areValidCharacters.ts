import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

const CYRILLIC_REGEX =
  /[\u0400-\u04FF\u0500-\u052F\u2DE0-\u2DFF\uA640-\uA69F]/;

const EMOJI_REGEX =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

export function ValidCharacters(
  validationOptions?: ValidationOptions
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'ValidCharacters',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown, _args: ValidationArguments) {
          if (value === null || value === undefined) return true;
          if (typeof value !== 'string') return true;

          const normalized = value.normalize('NFC');

          return (
            !CYRILLIC_REGEX.test(normalized) &&
            !EMOJI_REGEX.test(normalized)
          );
        },

        defaultMessage() {
          return 'Incorrect characters.';
        },
      },
    });
  };
}
