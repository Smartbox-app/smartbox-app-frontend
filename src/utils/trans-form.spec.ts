import { ApiErrorCode } from 'smartbox-types';
import { formOnTranslateString, translateApiErrorCode } from './trans-form';

describe('formOnTranslateString', () => {
  it('returns an unknown key unchanged', () => {
    expect(formOnTranslateString('missing.key')).toBe('missing.key');
  });

  it('joins object params and leaves a missing index', () => {
    expect(
      formOnTranslateString('Invalid option: {0}.', [{ a: 'x', b: 'y' }]),
    ).toBe('Nieprawidłowa opcja: x,y.');
    expect(formOnTranslateString('Invalid option: {0}.', [])).toBe(
      'Nieprawidłowa opcja: {0}.',
    );
  });
});

describe('translateApiErrorCode', () => {
  it('returns the polish message for a known code', () => {
    expect(translateApiErrorCode(ApiErrorCode.InvalidLoginData, 'pl')).toBe(
      'Niepoprawne dane logowania!',
    );
  });

  it('falls back to the enum name when the language has no catalog', () => {
    expect(translateApiErrorCode(ApiErrorCode.InvalidLoginData, 'de')).toBe(
      'InvalidLoginData',
    );
  });
});
