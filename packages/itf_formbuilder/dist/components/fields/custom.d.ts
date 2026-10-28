import { FormFieldBase, FormFieldType } from "../../formBuilder";
export interface CustomField extends FormFieldBase {
    type: FormFieldType.Custom;
}
export declare function defaultEmptyVal(field: CustomField): any;
export declare function defaultOptionsValidator(field: Required<CustomField>): Promise<void>;
export declare function formDataStrToRealValue(str: string, field: CustomField): any;
export declare function createCustomField(fieldId: string, value: string | any, title?: string): CustomField;
