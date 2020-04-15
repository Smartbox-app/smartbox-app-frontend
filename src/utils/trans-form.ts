// import * as errorTranslations from '../data/errorsTranslations.json';
// eslint-disable-next-line @typescript-eslint/no-var-requires
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
