import i18next from 'i18next';

import { Language } from 'smartbox-types';

export const SUPPORTED_LANGUAGES = Object.values(Language);

export type AppLanguage = Language;

export const isAppLanguage = (value: unknown): value is AppLanguage =>
  typeof value === 'string' && SUPPORTED_LANGUAGES.includes(value as Language);

/** Browser tags use ISO 639-1 (`cs`, `uk`); stored app codes are `cz` and `ua`. */
const BROWSER_LANGUAGE: Record<string, AppLanguage> = {
  pl: Language.pl,
  en: Language.en,
  de: Language.de,
  cs: Language.cz,
  cz: Language.cz,
  uk: Language.ua,
  ua: Language.ua,
};

const browserLanguages = (): readonly string[] => {
  if (typeof navigator === 'undefined') return [];
  if (navigator.languages?.length) return navigator.languages;
  if (navigator.language) return [navigator.language];
  return [];
};

export const detectBrowserLanguage = (
  languages?: readonly string[],
): AppLanguage => {
  const list = languages ?? browserLanguages();

  for (const code of list) {
    if (!code) continue;
    const base = code.toLowerCase().split('-')[0];
    const language = BROWSER_LANGUAGE[base];
    if (language) return language;
  }

  return Language.pl;
};

export const currentAppLanguage = (): AppLanguage => {
  const base = i18next.language?.toLowerCase().split('-')[0];
  return isAppLanguage(base) ? base : Language.pl;
};
