 
import { useTranslation } from 'react-i18next';

import { defaultNS } from '../../constants';
import type { I18nResourceKey, Options } from '../../types';

const sanitize = (str: string) => {
  const sanitized = str.replace(/[^a-z0-9áéíóúñü .,_'"-]/gim, '');

  return sanitized.trim();
};

type TranslateFn = (key: I18nResourceKey, options?: Options | string) => string;

export const createTranslateFunction =
  (translate: TranslateFn): TranslateFn =>
  (key, options) => {
    if (typeof options === 'string') {
      return translate(key, options);
    }

    return translate(key, {
      ...options,
      interpolation: options?.interpolation ?? {
        escape: sanitize,
      },
    });
  };

export const useI18n = () => {
  const translation = useTranslation(defaultNS);
  const { t: translate } = translation;

  return { ...translation, t: createTranslateFunction(translate as TranslateFn) };
};
