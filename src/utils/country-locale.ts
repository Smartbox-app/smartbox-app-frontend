import countries from 'i18n-iso-countries';

import { currentAppLanguage, type AppLanguage } from 'src/i18n/app-language';

/** i18n-iso-countries uses ISO 639-1 codes, not the stored app codes. */
export const COUNTRY_LOCALE: Record<AppLanguage, string> = {
  pl: 'pl',
  en: 'en',
  cz: 'cs',
  ua: 'uk',
  de: 'de',
};

export const BCP47_LOCALE: Record<AppLanguage, string> = {
  pl: 'pl-PL',
  en: 'en-GB',
  cz: 'cs-CZ',
  ua: 'uk-UA',
  de: 'de-DE',
};

/** Mapbox GL country-label field name per app language. */
export const MAPBOX_COUNTRY_NAME_FIELD: Record<AppLanguage, string> = {
  pl: 'name_pl',
  en: 'name_en',
  cz: 'name_cs',
  ua: 'name_uk',
  de: 'name_de',
};

export const localizedCountryName = (
  isoCode: string,
  lang: AppLanguage = currentAppLanguage(),
): string | undefined => {
  if (!countries.isValid(isoCode)) return undefined;
  return countries.getName(isoCode, COUNTRY_LOCALE[lang]) ?? undefined;
};
