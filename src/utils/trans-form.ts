// import * as errorTranslations from '../data/errorsTranslations.json';
// eslint-disable-next-line @typescript-eslint/no-var-requires
import { ApiErrorCode } from 'smartbox-types';

const errorTranslations = require('../data/errorsTranslations.json');
// JK: dont know why, but works. Sholud be import..

export function formOnTranslateString(s: string): string {
  const transes: {
    [lang: string]: {
      [key: string]: string;
    };
  } = errorTranslations;

  if (transes && transes.pl && transes.pl[s]) {
    return transes.pl[s];
  }

  return s;
}

// export function translateApiErrorCode(apiErrorCode: ApiErrorCode, lang: string): string {
//   const msg = errors[lang]._API_ERROR_CODES_[String(apiErrorCode)];
//
//   if (!msg) {
//     console.error(
//       'Missing translation. ApiErrorCode:',
//       ApiErrorCode[apiErrorCode],
//       'key:',
//       String(apiErrorCode),
//       'lang:',
//       lang,
//     );
//   }
//
//   return msg.text || ApiErrorCode[apiErrorCode];
// }
