import flatpickr from 'flatpickr';
import { english } from 'flatpickr/dist/l10n/default';
import { Czech } from 'flatpickr/dist/l10n/cs';
import { German } from 'flatpickr/dist/l10n/de';
import { Polish } from 'flatpickr/dist/l10n/pl';
import { Ukrainian } from 'flatpickr/dist/l10n/uk';

import { currentAppLanguage, type AppLanguage } from './app-language';

const LOCALES: Record<AppLanguage, flatpickr.CustomLocale> = {
  pl: Polish,
  en: english,
  cz: Czech,
  ua: Ukrainian,
  de: German,
};

export const flatpickrLocale = () => LOCALES[currentAppLanguage()];

export const applyFlatpickrLocale = () => {
  flatpickr.localize(flatpickrLocale());
  flatpickr.defaultConfig.time_24hr = true;
};
