import { Language } from 'smartbox-types';

import { __ } from '../helpers/i18n';
import { currentAppLanguage } from '../i18n/app-language';

export type PeriodPricingType =
  | 'day'
  | 'week'
  | 'month'
  | 'quarter'
  | 'half_year'
  | 'year';

export type PeriodPluralForm = 'one' | 'few' | 'many';

const SLAVIC = new Set<Language>([Language.pl, Language.cz, Language.ua]);

export const periodPluralForm = (
  quantity: number,
  language = currentAppLanguage(),
): PeriodPluralForm => {
  const count = Math.abs(Math.trunc(quantity));

  if (SLAVIC.has(language)) {
    if (count % 10 === 1 && count % 100 !== 11) return 'one';
    if (
      count % 10 >= 2 &&
      count % 10 <= 4 &&
      (count % 100 < 12 || count % 100 > 14)
    ) {
      return 'few';
    }
    return 'many';
  }

  return count === 1 ? 'one' : 'many';
};

export const formatPeriodQuantity = (
  type: PeriodPricingType,
  quantity: number,
): string => __(`application.periodUnit.${type}.${periodPluralForm(quantity)}`);
