import { FormFieldBase, FormFieldType } from "../../formBuilder";
export interface HeaderField extends FormFieldBase {
    type: FormFieldType.Header;
}
export declare function defaultEmptyVal(field: HeaderField): any;
export declare function defaultOptionsValidator(field: Required<HeaderField>): Promise<void>;
export declare function formDataStrToRealValue(str: string, field: HeaderField): any;
export declare function createHeaderField(fieldId: string, title?: string, visibilityAndActivity?: (allValues: any) => boolean | Promise<boolean>, valueOnInactivity?: any): HeaderField;
