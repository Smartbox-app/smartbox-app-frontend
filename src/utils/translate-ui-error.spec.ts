import { i18next } from '../i18n/i18n';
import { translateUiError } from './translate-ui-error';

describe('translateUiError', () => {
  afterEach(async () => {
    await i18next.changeLanguage('pl');
  });

  it('translates a validation key in the current language', async () => {
    await i18next.changeLanguage('de');

    expect(translateUiError('validation.field_required')).toBe(
      'Dieses Feld ist erforderlich',
    );
  });

  it('interpolates the minimum length stored with the key', async () => {
    await i18next.changeLanguage('pl');

    expect(translateUiError('validation.min_chars:8')).toBe(
      'Wymagane min 8 znaków',
    );
  });

  it('leaves a sentence that is not a key unchanged', () => {
    expect(translateUiError('To pole jest wymagane.')).toBe(
      'To pole jest wymagane.',
    );
  });
});
