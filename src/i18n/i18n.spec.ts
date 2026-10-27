import { i18next, t } from 'src/i18n/i18n';
import applicationCz from 'src/i18n/locales/cz/application';
import applicationDe from 'src/i18n/locales/de/application';
import application from 'src/i18n/locales/pl/application';
import applicationUa from 'src/i18n/locales/ua/application';
import type { I18nResourceKey } from 'src/i18n/types';

describe('i18n', () => {
  it('correctly translates value without parameters', () => {
    const translated = t('application.management');

    expect(translated).toEqual(application.application.management);
  });

  it('correctly translates value with parameter', () => {
    const translated = t('validation.min_chars', { length: 5 });

    expect(translated).toEqual(
      application.validation.min_chars.replace('{{length}}', '5'),
    );
  });

  it.each([
    ['cz', applicationCz],
    ['ua', applicationUa],
    ['de', applicationDe],
  ] as const)('uses the %s catalog', async (language, catalog) => {
    await i18next.changeLanguage(language);

    expect(i18next.language).toBe(language);
    expect(t('application.management')).toEqual(catalog.application.management);
    expect(t('auth.login')).toEqual(catalog.auth.login);
    expect(catalog.auth.login).not.toEqual(application.auth.login);

    await i18next.changeLanguage('pl');
  });

  it('correctly renders value with incorrect key', () => {
    const translated = t(
      'incorrect_key_that_does_not_exist' as I18nResourceKey,
    );

    expect(translated).toEqual('incorrect_key_that_does_not_exist');
  });
});
