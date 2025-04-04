// import * as errorTranslations from '../data/errorsTranslations.json';
 
import { ApiErrorCode } from 'smartbox-types';

const errors = require('../data/errorsTranslations.json');
// JK: dont know why, but works. Sholud be import..

export function formOnTranslateString(s: string, params?: any[]): string {
    const transes: {
        [lang: string]: {
            [key: string]: string;
        };
    } = errors;

    let translated;
    if (transes && transes.pl && transes.pl[s]) {
        translated = transes.pl[s];
    } else return s;

    if (params && translated) {
        return translated.replace(/{(\d+)}/g, (match: any, number: number) =>
            typeof params[number] !== 'undefined'
                ? typeof params[number] === 'object'
                    ? Object.values(params[number])
                    : params[number]
                : match,
        );
    }

    return translated;
}

export function translateApiErrorCode(apiErrorCode: ApiErrorCode, lang: string): string {
    const msg = errors[lang]._API_ERROR_CODES_[String(apiErrorCode)];

    if (!msg) {
        console.error(
            'Missing translation. ApiErrorCode:',
            ApiErrorCode[apiErrorCode],
            'key:',
            String(apiErrorCode),
            'lang:',
            lang,
        );
    }

    return msg.text || ApiErrorCode[apiErrorCode];
}
