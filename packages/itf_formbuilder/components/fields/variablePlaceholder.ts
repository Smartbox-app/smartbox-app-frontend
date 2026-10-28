import {FormFieldBase, FormFieldType} from '../../formBuilder';
import {TranslatableError} from "../utils/translatableError";
import {requiredValidator} from "../validators";
import * as checkbox from './checkbox';

export enum ExpectedVarType {
    any,
    number,
    string,
    boolean,
    object,
    arrayOfStrings,
    arrayOfNumbers,
    arrayOfObjects,
    arrayOfAny,
}

export interface FormFieldVariablePlaceholder extends FormFieldBase {
    type: FormFieldType.VariablePlaceholder;
    value?: any;
    settings: {
        varType: ExpectedVarType;
    };
}

export function defaultEmptyVal(field: FormFieldVariablePlaceholder): any {
    return null;
}

export async function defaultOptionsValidator(field: Required<FormFieldVariablePlaceholder>) {
    const {value, settings} = field;
    const {varType} = settings;


    switch(varType) {
        case ExpectedVarType.number:
            if (typeof value !== 'number') {
                throw new TranslatableError('Invalid type of value: {0} expected.', 'number');
            }
            break;
        case ExpectedVarType.string:
            if (typeof value !== 'string') {
                throw new TranslatableError('Invalid type of value: {0} expected.', 'string');
            }
            break;
        case ExpectedVarType.boolean:
            if (typeof value !== 'boolean') {
                throw new TranslatableError('Invalid type of value: {0} expected.', 'boolean');
            }
            break;
        case ExpectedVarType.object:
            if (typeof value !== 'object') {
                throw new TranslatableError('Invalid type of value: {0} expected.', 'object');
            }
            break;
        case ExpectedVarType.arrayOfStrings:
            if (!value.find || value.find((v: any) => typeof v !== 'string')) {
                throw new TranslatableError('Invalid type of value: {0} expected.', 'array of strings');
            }
            break;
        case ExpectedVarType.arrayOfNumbers:
            if (!value.find || value.find((v: any) => typeof v !== 'number')) {
                throw new TranslatableError('Invalid type of value: {0} expected.', 'array of numbers');
            }
            break;
        case ExpectedVarType.arrayOfObjects:
            if (!value.find || value.find((v: any) => typeof v !== 'object')) {
                throw new TranslatableError('Invalid type of value: {0} expected.', 'array of objects');
            }
            break;
        case ExpectedVarType.arrayOfAny:
            if (!value.find) {
                throw new TranslatableError('Invalid type of value: {0} expected.', 'any array');
            }
            break;
    }
}

export function formDataStrToRealValue(str: string, field: FormFieldVariablePlaceholder): any {
    const {settings} = field;
    const {varType} = settings;


    switch(varType) {
        case ExpectedVarType.number:
            return Number(str);
        case ExpectedVarType.string:
            return str;
        case ExpectedVarType.boolean:
            return checkbox.formDataStrToRealValue(str, field as any);
        case ExpectedVarType.arrayOfStrings:
            return str.split(',').map(s => s.trim());
        case ExpectedVarType.arrayOfNumbers:
            return str.split(',').map(s => Number(s.trim()));
        default:
            throw new TranslatableError('Cannot decode this type of data when using FormData.');
    }
}

export function createVarField(fieldId: string, varType: ExpectedVarType, fieldOpts: Partial<FormFieldBase>): FormFieldVariablePlaceholder {
    const field: any = {
        ...fieldOpts,
        id: fieldId,
        title: '',
        settings: {
            varType,
        },
    };

    if (field.required === true) {
        field.validators = field.validators || [];
        field.validators.push(requiredValidator());
    }

    return {
        ...field,
        type: FormFieldType.VariablePlaceholder,
    };
}