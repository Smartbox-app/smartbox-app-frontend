import format from "./format";

export interface TranslatableObject {
    messageWithPlaceholders: string;
    messageCompiled: string;
    params: any[];
}

export class TranslatableError extends Error {
    private params: any[] = [];

    constructor(private messageWithPlaceholders: string, ...params: any[]) {
        super(format(messageWithPlaceholders, ...params));
        this.params = params;

        Object.setPrototypeOf(this, TranslatableError.prototype); // Hack required to make it work!
    }

    getTranslatableObject(): TranslatableObject {
        const {params, messageWithPlaceholders} = this;
        return {params, messageWithPlaceholders, messageCompiled: format(messageWithPlaceholders, ...params)};
    }
}

export function getTranslatableError(messageWithPlaceholders: string, ...params: any[]): TranslatableObject {
    return (new TranslatableError(messageWithPlaceholders, ...params)).getTranslatableObject();
}