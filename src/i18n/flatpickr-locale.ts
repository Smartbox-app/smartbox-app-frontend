import flatpickr from 'flatpickr';
import { english } from 'flatpickr/dist/l10n/default';
import { Polish } from 'flatpickr/dist/l10n/pl';

import { currentAppLanguage } from './app-language';

export const flatpickrLocale = () =>
  currentAppLanguage() === 'en' ? english : Polish;

export const applyFlatpickrLocale = () => {
  flatpickr.localize(flatpickrLocale());
  flatpickr.defaultConfig.time_24hr = true;
};
