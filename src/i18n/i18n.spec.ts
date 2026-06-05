import application from './locales/pl/application';
import { t } from './i18n';
import type { I18nResourceKey } from './types';

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

  it('correctly renders value with incorrect key', () => {
    const translated = t(
      'incorrect_key_that_does_not_exist' as I18nResourceKey,
    );

    expect(translated).toEqual('incorrect_key_that_does_not_exist');
  });
});
