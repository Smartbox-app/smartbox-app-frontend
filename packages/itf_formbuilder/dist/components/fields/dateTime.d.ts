import { FormFieldBase, FormFieldType } from '../../formBuilder';
export interface FormFieldDateTime extends FormFieldBase {
    type: FormFieldType.DateTime;
    value?: Date | string | Date[] | string[] | null;
    options?: {
        min?: Date;
        max?: Date;
        includeHours?: boolean;
        multiple?: boolean;
        descriptionBelow?: boolean;
    };
    settings?: {
        defaultEmptyVal?: any;
    };
}
export declare function defaultEmptyVal(field: Required<FormFieldDateTime>): any;
export declare function formDataStrToRealValue(str: string, field: FormFieldDateTime): any;
export declare function defaultOptionsValidator(field: Required<FormFieldDateTime>): Promise<void>;
export declare function createDateTimeField(field: Pick<FormFieldDateTime, Exclude<keyof FormFieldDateTime, 'type'>>): FormFieldDateTime;
