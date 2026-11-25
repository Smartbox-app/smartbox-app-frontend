import { TranslatableObject } from "itf_formbuilder";
export declare class TranslatableError extends Error {
    private messageWithPlaceholders;
    private params;
    constructor(messageWithPlaceholders: string, ...params: any[]);
    getTranslatableObject(): TranslatableObject;
}
export declare function getTranslatableError(messageWithPlaceholders: string, ...params: any[]): TranslatableObject;
