import i18next from 'i18next';

export const SUPPORTED_LANGUAGES = ['pl', 'en'] as const;

export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const isAppLanguage = (value: unknown): value is AppLanguage =>
  value === 'pl' || value === 'en';

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
    if (base === 'en' || base === 'pl') return base;
  }

  return 'pl';
};

export const currentAppLanguage = (): AppLanguage => {
  const base = i18next.language?.toLowerCase().split('-')[0];
  return isAppLanguage(base) ? base : 'pl';
};
