import { ValidationArguments } from 'class-validator';

import { CustomEmailValidator } from 'src/validators/IsCustomEmail';

const args = {} as ValidationArguments;

describe('CustomEmailValidator', () => {
  const validator = new CustomEmailValidator();

  it('trims the address before checking it', () => {
    expect(validator.validate('  ada@example.com  ', args)).toBe(true);
  });

  it('rejects a non-email and a non-string', () => {
    expect(validator.validate('not-an-email', args)).toBe(false);
    expect(validator.validate(12, args)).toBe(false);
  });
});
