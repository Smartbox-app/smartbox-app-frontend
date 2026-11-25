import { TranslatableObject } from './components/utils/translatableError';
export declare enum FormFieldType {
    Text = "text",
    Number = "number",
    Textarea = "textarea",
    Wysywig = "wysywig",
    Checkbox = "checkbox",
    StaticSelect = "staticSelect",
    DateTime = "dateTime",
    Entity = "entity",
    VariablePlaceholder = "variablePlaceholder",
    FileDragDrop = "fileDragDrop",
    GroupStart = "groupStart",
    GroupEnd = "groupEnd",
    Header = "header",
    Custom = "custom"
}
export declare type FormFieldAsyncOrSyncValidator = <T>(field: T) => any;
export declare type FormFieldAsyncOrSyncTransformer = <T>(field: T) => any;
export interface FormFieldBase {
    id: string;
    type: FormFieldType | string;
    title: string;
    required?: boolean;
    readOnly?: boolean;
    descr?: string;
    placeholder?: string;
    value?: any;
    options?: any;
    settings?: any;
    doNotAutoValidateOptions?: boolean;
    validators?: FormFieldAsyncOrSyncValidator[];
    transformer?: FormFieldAsyncOrSyncTransformer;
    visibilityAndActivity?: (allValues: any) => boolean | Promise<boolean>;
    valueOnInactivity?: any;
}
export interface FormErrors {
    [fieldId: string]: TranslatableObject[];
}
export declare class FormBuilder {
    private state;
    private fields;
    private errors;
    constructor();
    private makeSureFormIsInState;
    static dynamicLoadFieldFile(field: FormFieldBase): any;
    static getFieldEmptyVal(field: FormFieldBase): any;
    appendField(field: FormFieldBase): FormBuilder;
    getJson(): string;
    build(): FormBuilder;
    loadValues(valuesObj: any, isFormData?: boolean): FormBuilder;
    getVal<T>(fieldId: string): Promise<T>;
    getAllVals(): any;
    addError(fieldId: string, error: TranslatableObject): void;
    validateField(field: FormFieldBase): Promise<void>;
    evalIsActive(field: FormFieldBase, allVals: any): Promise<boolean>;
    validate(): Promise<boolean>;
    hasAnyErrors(): boolean;
    getErrors(): FormErrors;
    private formDataFieldToRealVal;
}
