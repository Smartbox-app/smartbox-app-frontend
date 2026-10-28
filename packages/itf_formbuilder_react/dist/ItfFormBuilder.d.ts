import * as React from 'react';
import { SyntheticEvent } from 'react';
import { FormErrors, FormFieldType, TranslatableObject } from 'itf_formbuilder';
import { FlatpickrFn } from 'flatpickr/dist/types/instance';
import SelectBase from 'react-select/lib/Select';
export interface FormFieldToRender {
    id: string;
    type: FormFieldType | string;
    title: string;
    required: boolean;
    readOnly: boolean;
    descr: string;
    placeholder: string;
    value: any;
    options?: any;
    visibilityAndActivity?: string;
    valueOnInactivity?: any;
}
export declare type ChangeFunction = (currentValue: any) => void;
export declare type FieldAndEventFunction = (field: FormFieldToRender, ev: SyntheticEvent) => void;
declare type Constructor<T> = Function & {
    prototype: T;
};
export interface ThirdPartyComponents {
    flatpickr?: FlatpickrFn;
    ReactSelect?: Constructor<SelectBase<any>>;
    ReactCreatableSelect?: Constructor<SelectBase<any>>;
    CKEditor?: any;
    CKEditorEditorBuild?: any;
}
export interface ItfFormBuilderProps {
    formId: string;
    formSchema: FormFieldToRender[];
    onFormSubmit: (fieldVals: any | FormData) => Promise<void> | void;
    submitButton?: any;
    loadingInfo?: any;
    loadingInfoAboveContent?: boolean;
    errors?: FormErrors;
    requiredIndicator?: string | React.ReactNode;
    onRenderCustomFieldByType?: (field: FormFieldToRender, fieldHtmlId: string, currentValue: any, onChange: ChangeFunction, onFocus: FieldAndEventFunction, onBlur: FieldAndEventFunction) => any;
    onValidateField?: (field: FormFieldToRender) => TranslatableObject | string | never;
    onTouch?: (field: FormFieldToRender, currentValue: any) => any;
    onFocus?: (field: FormFieldToRender, ev: SyntheticEvent) => any;
    onBlur?: (field: FormFieldToRender, ev: SyntheticEvent) => any;
    onRenderFullField?: (field: FormFieldToRender, errors: TranslatableObject[], fieldHtmlId: string, currentValue: any, onChange: ChangeFunction, onFocus: FieldAndEventFunction, onBlur: FieldAndEventFunction) => any;
    onTranslateString?: (s: string) => string;
    thirdPartyComponents?: ThirdPartyComponents;
    registerAsGlobalForm?: boolean;
    enableLiveValuesOfGlobalForm?: boolean;
    useFormDataInsteadOfPlainObject?: boolean;
    sendDelay?: number;
    noRefreshAfterSuccess?: boolean;
    onFormGloballyRegistered?: (api: PublicItfFormBuilderComponentApi) => any;
}
interface State {
    values: {
        [id: string]: any;
    };
    errors: FormErrors;
    loading: boolean;
    inactiveFields: string[];
}
export interface PublicItfFormBuilderComponentApi {
    send(): Promise<void>;
    resetAll(): void;
    resetValues(): void;
    resetInternalErrors(): void;
    focusField(fieldId: string): void;
    setValue(fieldId: string, value: string | number | boolean): void;
}
export interface RefToItfFormBuilderComponent {
    api: PublicItfFormBuilderComponentApi;
}
export declare class ItfFormBuilder extends React.Component<ItfFormBuilderProps, State> implements RefToItfFormBuilderComponent {
    randNum: number;
    globalChange: (fields: {
        [fieldId: string]: string | number | boolean;
    }) => void;
    changeFunctions: {
        [id: string]: ChangeFunction;
    };
    blurFunctions: {
        [id: string]: ChangeFunction;
    };
    focusFunctions: {
        [id: string]: ChangeFunction;
    };
    activityCheckFunctions: {
        [id: string]: (allValues: any) => boolean | Promise<boolean>;
    };
    private groupActive;
    private groupCache;
    constructor(props: ItfFormBuilderProps);
    componentDidMount(): void;
    componentDidUpdate(prevProps: ItfFormBuilderProps): void;
    componentWillUnmount(): void;
    api: {
        send: () => Promise<void>;
        resetAll: () => void;
        resetValues: () => void;
        setValue: (field: string, value: string | number | boolean) => void;
        setValues: (fields: {
            [fieldId: string]: string | number | boolean;
        }) => void;
        getValue: (fieldId: string) => any;
        resetInternalErrors: () => void;
        focusField: (fieldId: string) => void;
    };
    private transAndFormat;
    private transPlainStr;
    private renderErrors;
    private genFieldId;
    private passDataToPropsOfStandardInput;
    private renderFieldBasedOnType;
    private buildClassNameForContainer;
    private renderCheckboxField;
    private renderSingleFullField;
    private plainObjectToFormData;
    private handleFormSubmit;
    private deepErrorsCopy;
    private checkFieldsInactivity;
    private getSubmitButton;
    render(): any;
}
export {};
