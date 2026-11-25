import format from "./format";
import {TranslatableObject} from "itf_formbuilder";

export class TranslatableError extends Error {
    private params: any[] = [];

    constructor(private messageWithPlaceholders: string, ...params: any[]) {
        super(format(messageWithPlaceholders, ...params));
        this.params = params;
    }

    getTranslatableObject(): TranslatableObject {
        const {params, messageWithPlaceholders} = this;
        return {params, messageWithPlaceholders, messageCompiled: format(messageWithPlaceholders, ...params)};
    }
}

export function getTranslatableError(messageWithPlaceholders: string, ...params: any[]): TranslatableObject {
    return (new TranslatableError(messageWithPlaceholders, ...params)).getTranslatableObject();
}