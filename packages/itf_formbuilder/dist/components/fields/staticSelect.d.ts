import { FormFieldBase, FormFieldType } from '../../formBuilder';
interface ValuesStrKeyObj {
    [key: string]: string;
}
interface ValuesNumKeyObj {
    [key: number]: string;
}
interface SelectOption {
    value: string | number | boolean;
    name: string | number;
}
export interface FormFieldStaticSelect extends FormFieldBase {
    type: FormFieldType.StaticSelect;
    value?: null | string | string[] | number | number[] | boolean | boolean[];
    options?: {
        possibleValues: ValuesStrKeyObj | ValuesNumKeyObj | SelectOption[];
        multipleChoices?: boolean;
        useReactSelectComponent?: boolean;
        creatable?: boolean;
        translateValues?: boolean;
        translateCreatedValue?: boolean;
        descriptionBelow?: boolean;
    };
}
export declare function defaultEmptyVal(field: Required<FormFieldStaticSelect>): any;
export declare function formDataStrToRealValue(str: string, field: FormFieldStaticSelect): any;
export declare function defaultOptionsValidator(field: Required<FormFieldStaticSelect>): Promise<void>;
export declare function createStaticSelectField(field: Pick<FormFieldStaticSelect, Exclude<keyof FormFieldStaticSelect, 'type'>>): FormFieldStaticSelect;
export {};
