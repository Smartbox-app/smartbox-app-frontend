import countries from 'i18n-iso-countries';
import { useMemo } from 'react';

import { currentAppLanguage, type AppLanguage } from 'src/i18n/app-language';
import { COUNTRY_LOCALE } from 'src/utils/country-locale';

const PRIORITY_COUNTRIES: Record<AppLanguage, string[]> = {
  pl: ['Polska', 'Ukraina', 'Niemcy', 'Austria'],
  en: ['Poland', 'Ukraine', 'Germany', 'Austria'],
  cz: ['Polsko', 'Ukrajina', 'Německo', 'Rakousko'],
  ua: ['Польща', 'Україна', 'Німеччина', 'Австрія'],
  de: ['Polen', 'Ukraine', 'Deutschland', 'Österreich'],
};

export const useGetCountriesList = () => {
  const lang = currentAppLanguage();
  const countriesList = useMemo(() => {
    const names = countries.getNames(COUNTRY_LOCALE[lang]);
    const forcedOrder = PRIORITY_COUNTRIES[lang];

    return Object.entries(names)
      .sort((a, b) => {
        const aPriority = forcedOrder.findIndex((country) => country === a[1]);
        const bPriority = forcedOrder.findIndex((country) => country === b[1]);

        if (aPriority !== -1 || bPriority !== -1) {
          if (aPriority === -1) return 1;
          if (bPriority === -1) return -1;
          return aPriority - bPriority;
        }

        return b[1] < a[1] ? 1 : -1;
      })
      .map(([value, label]) => ({ value, label }));
  }, [lang]);

  return countriesList;
};
