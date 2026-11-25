import { FormFieldBase, FormFieldType } from '../../formBuilder';
export interface FormFieldWysywig extends FormFieldBase {
    type: FormFieldType.Wysywig;
    value?: string;
    options?: {
        minLength?: number;
        maxLength?: number;
    };
}
export declare function defaultEmptyVal(field: FormFieldWysywig): any;
export declare function formDataStrToRealValue(str: string, field: FormFieldWysywig): any;
export declare function defaultOptionsValidator(field: Required<FormFieldWysywig>): Promise<void>;
export declare function createWysywigField(field: Pick<FormFieldWysywig, Exclude<keyof FormFieldWysywig, 'type'>>): FormFieldWysywig;
