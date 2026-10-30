import { FormFieldBase, FormFieldType } from '../../formBuilder';
export interface FormFieldCheckbox extends FormFieldBase {
    type: FormFieldType.Checkbox;
    value?: boolean;
    options?: {};
}
export declare function defaultEmptyVal(field: FormFieldCheckbox): any;
export declare function defaultOptionsValidator(field: FormFieldCheckbox): Promise<void>;
export declare function formDataStrToRealValue(str: string, field: FormFieldCheckbox): any;
export declare function createCheckboxField(field: Pick<FormFieldCheckbox, Exclude<keyof FormFieldCheckbox, 'type'>>): FormFieldCheckbox;
