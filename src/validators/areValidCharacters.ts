import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

// Cyrillic Extended-A is combining marks. Kept separate so it is not
// read as a grapheme with the letter that ends the previous range.
const CYRILLIC_REGEX =
  /[\u0400-\u04FF\u0500-\u052F\uA640-\uA69F]|[\u2DE0-\u2DFF]/;

const EMOJI_REGEX =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;

export const hasValidCharacters = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value !== 'string') return true;

  const normalized = value.normalize('NFC');

  return !CYRILLIC_REGEX.test(normalized) && !EMOJI_REGEX.test(normalized);
};

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
          return hasValidCharacters(value);
        },

        defaultMessage() {
          return 'Incorrect characters.';
        },
      },
    });
  };
}
