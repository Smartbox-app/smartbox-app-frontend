import { FormFieldBase, FormFieldType } from "../../formBuilder";
export interface FormFieldGroupStart extends FormFieldBase {
    type: FormFieldType.GroupStart;
}
export declare function defaultEmptyVal(field: FormFieldGroupStart): any;
export declare function defaultOptionsValidator(field: Required<FormFieldGroupStart>): Promise<void>;
export declare function formDataStrToRealValue(): any;
export declare function createGroupStartField(id: string): FormFieldGroupStart;
