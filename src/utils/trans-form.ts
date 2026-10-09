// import * as errorTranslations from '../data/errorsTranslations.json';
 
import { ApiErrorCode } from 'smartbox-types';

import errors from '../data/errorsTranslations.json';
// JK: dont know why, but works. Sholud be import..

export function formOnTranslateString(s: string, params?: unknown[]): string {
    const pl = (errors as unknown as { pl?: Record<string, string> }).pl;

    if (!pl?.[s]) return s;
    const translated = pl[s];

    if (params && translated) {
        return translated.replace(/{(\d+)}/g, (match: string, number: string) => {
            const value = params[Number(number)];
            if (typeof value === 'undefined') return match;
            if (typeof value === 'object' && value !== null) {
                return Object.values(value).join(',');
            }
            return String(value);
        });
    }

    return translated;
}

export function translateApiErrorCode(apiErrorCode: ApiErrorCode, lang: string): string {
    const catalog = errors as unknown as Record<
        string,
        { _API_ERROR_CODES_?: Record<string, { text?: string }> }
    >;
    const msg = catalog[lang]?._API_ERROR_CODES_?.[String(apiErrorCode)];

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

    return msg?.text || ApiErrorCode[apiErrorCode];
}
