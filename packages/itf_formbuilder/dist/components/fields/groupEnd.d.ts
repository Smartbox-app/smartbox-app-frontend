import { FormFieldBase, FormFieldType } from "../../formBuilder";
export interface FormFieldGroupEnd extends FormFieldBase {
    type: FormFieldType.GroupEnd;
}
export declare function defaultEmptyVal(field: FormFieldGroupEnd): any;
export declare function defaultOptionsValidator(field: Required<FormFieldGroupEnd>): Promise<void>;
export declare function formDataStrToRealValue(str: string, field: FormFieldGroupEnd): any;
export declare function createGroupEndField(id: string): FormFieldGroupEnd;
