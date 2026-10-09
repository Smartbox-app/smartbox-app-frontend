import { validateNip } from './nip';

describe('validateNip by country', () => {
  it('rejects an empty value or country', () => {
    expect(validateNip('', 'PL')).toBe(false);
    expect(validateNip('1234563218', '')).toBe(false);
  });

  it('checks a polish vat number that includes the PL prefix', () => {
    expect(validateNip('PL1234563218', 'PL')).toBe(true);
    expect(validateNip('1234563218', 'PL')).toBe(false);
    expect(validateNip('PL1234563219', 'PL')).toBe(false);
  });

  it('checks length for Ukraine and accepts other countries', () => {
    expect(validateNip('1234567890', 'UA')).toBe(true);
    expect(validateNip('123', 'UA')).toBe(false);
    expect(validateNip('anything', 'XX')).toBe(true);
  });
});
