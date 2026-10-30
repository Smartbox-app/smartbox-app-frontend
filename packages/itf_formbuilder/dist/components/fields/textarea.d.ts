import { FormFieldBase, FormFieldType } from '../../formBuilder';
export interface FormFieldTextarea extends FormFieldBase {
    type: FormFieldType.Textarea;
    value?: string;
    options?: {
        minLength?: number;
        maxLength?: number;
        descriptionBelow?: boolean;
    };
}
export declare function defaultEmptyVal(field: FormFieldTextarea): any;
export declare function formDataStrToRealValue(str: string, field: FormFieldTextarea): any;
export declare function defaultOptionsValidator(field: Required<FormFieldTextarea>): Promise<void>;
export declare function createTextareaField(field: Pick<FormFieldTextarea, Exclude<keyof FormFieldTextarea, 'type'>>): FormFieldTextarea;
