import { FormFieldBase, FormFieldType } from '../../formBuilder';
export interface FormFieldNumber extends FormFieldBase {
    type: FormFieldType.Number;
    value?: number;
    options?: {
        type?: string;
        isFloat?: boolean;
        step?: number;
        min?: number;
        max?: number;
        descriptionBelow?: boolean;
    };
    settings?: {
        defaultEmptyVal?: any;
    };
}
export declare function defaultEmptyVal(field: Required<FormFieldNumber>): any;
export declare function formDataStrToRealValue(str: string, field: FormFieldNumber): any;
export declare function defaultOptionsValidator(field: Required<FormFieldNumber>): Promise<void>;
export declare function createNumberField(field: Pick<FormFieldNumber, Exclude<keyof FormFieldNumber, 'type'>>): FormFieldNumber;
