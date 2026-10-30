import { __ } from 'src/helpers/i18n';

const MIN_CHARS = /^validation\.min_chars:(\d+)$/;

export const translateUiError = (message: string): string => {
  const minChars = MIN_CHARS.exec(message);
  if (minChars) {
    return __('validation.min_chars', { length: Number(minChars[1]) });
  }

  return __(message);
};
