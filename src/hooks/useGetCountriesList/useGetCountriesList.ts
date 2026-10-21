import countries from 'i18n-iso-countries';
import { useMemo } from 'react';
import { currentAppLanguage } from 'src/i18n/app-language';

const PRIORITY_COUNTRIES = {
  pl: ['Polska', 'Ukraina', 'Niemcy', 'Austria'],
  en: ['Poland', 'Ukraine', 'Germany', 'Austria'],
};

export const useGetCountriesList = () => {
  const lang = currentAppLanguage();
  const countriesList = useMemo(() => {
    const names = countries.getNames(lang);
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
