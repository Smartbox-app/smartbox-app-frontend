import { FormFieldBase, FormFieldType } from '../../formBuilder';
export interface FormFieldText extends FormFieldBase {
    type: FormFieldType.Text;
    value?: string;
    options?: {
        type?: string;
        pattern?: string;
        minLength?: number;
        maxLength?: number;
        descriptionBelow?: boolean;
    };
}
export declare function defaultEmptyVal(field: FormFieldText): any;
export declare function formDataStrToRealValue(str: string, field: FormFieldText): any;
export declare function defaultOptionsValidator(field: Required<FormFieldText>): Promise<void>;
export declare function createTextField(field: Pick<FormFieldText, Exclude<keyof FormFieldText, 'type'>>): FormFieldText;
