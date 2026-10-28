import { FormFieldBase, FormFieldType } from '../../formBuilder';
export declare enum ExpectedVarType {
    any = 0,
    number = 1,
    string = 2,
    boolean = 3,
    object = 4,
    arrayOfStrings = 5,
    arrayOfNumbers = 6,
    arrayOfObjects = 7,
    arrayOfAny = 8
}
export interface FormFieldVariablePlaceholder extends FormFieldBase {
    type: FormFieldType.VariablePlaceholder;
    value?: any;
    settings: {
        varType: ExpectedVarType;
    };
}
export declare function defaultEmptyVal(field: FormFieldVariablePlaceholder): any;
export declare function defaultOptionsValidator(field: Required<FormFieldVariablePlaceholder>): Promise<void>;
export declare function formDataStrToRealValue(str: string, field: FormFieldVariablePlaceholder): any;
export declare function createVarField(fieldId: string, varType: ExpectedVarType, fieldOpts: Partial<FormFieldBase>): FormFieldVariablePlaceholder;
