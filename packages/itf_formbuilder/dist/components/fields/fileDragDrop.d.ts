import { FormFieldBase, FormFieldType } from "../../formBuilder";
export interface FormFieldFileDragDrop extends FormFieldBase {
    type: FormFieldType.FileDragDrop;
    value?: any;
    options?: {
        isNotImage?: boolean;
        previewUrl?: string;
        accept?: string;
    };
}
export declare function defaultEmptyVal(field: FormFieldFileDragDrop): any;
export declare function defaultOptionsValidator(field: FormFieldFileDragDrop): Promise<void>;
export declare function formDataStrToRealValue(str: any, field: FormFieldFileDragDrop): any;
export declare function createFileDragDropField(field: Pick<FormFieldFileDragDrop, Exclude<keyof FormFieldFileDragDrop, "type">>): FormFieldFileDragDrop;
