import { Language } from 'smartbox-types';

import { i18next } from '../i18n/i18n';
import {
  formatPeriodQuantity,
  periodPluralForm,
} from './format-period-quantity';

describe('periodPluralForm', () => {
  it.each([
    [1, 'one'],
    [21, 'one'],
    [2, 'few'],
    [4, 'few'],
    [22, 'few'],
    [5, 'many'],
    [11, 'many'],
    [12, 'many'],
    [0, 'many'],
  ] as const)('uses the Slavic form for %s in Polish', (quantity, form) => {
    expect(periodPluralForm(quantity, Language.pl)).toBe(form);
    expect(periodPluralForm(quantity, Language.cz)).toBe(form);
    expect(periodPluralForm(quantity, Language.ua)).toBe(form);
  });

  it('uses one or many for German and English', () => {
    expect(periodPluralForm(1, Language.de)).toBe('one');
    expect(periodPluralForm(2, Language.de)).toBe('many');
    expect(periodPluralForm(1, Language.en)).toBe('one');
    expect(periodPluralForm(5, Language.en)).toBe('many');
  });
});

describe('formatPeriodQuantity', () => {
  afterEach(async () => {
    await i18next.changeLanguage('pl');
  });

  it('uses the Polish few and many forms', async () => {
    await i18next.changeLanguage('pl');

    expect(formatPeriodQuantity('week', 2)).toBe('tygodnie');
    expect(formatPeriodQuantity('week', 5)).toBe('tygodni');
    expect(formatPeriodQuantity('week', 22)).toBe('tygodnie');
  });

  it('uses the German plural for more than one', async () => {
    await i18next.changeLanguage('de');

    expect(formatPeriodQuantity('month', 1)).toBe('Monat');
    expect(formatPeriodQuantity('month', 3)).toBe('Monate');
  });
});
