import * as React from 'react';
import { FormErrors } from 'itf_formbuilder';
import { FormFieldToRender, ItfFormBuilderProps, PublicItfFormBuilderComponentApi, RefToItfFormBuilderComponent } from './ItfFormBuilder';
export declare type GetSchemaFetcherFunction = (formId: string) => Promise<FormFieldToRender[]> | FormFieldToRender[];
export declare type SendFormFetcherFunction = (formId: string, values: any | FormData) => Promise<FormErrors> | FormErrors | Promise<void> | void;
export declare type LoadingStateChangeFunction = (isLoading: boolean) => void | Promise<void>;
interface Props extends Partial<ItfFormBuilderProps> {
    formId: string;
    schemaMayBeDynamic: boolean;
    schemaFetcher: GetSchemaFetcherFunction;
    sendFetcher: SendFormFetcherFunction;
    sendDelay?: number;
    onLoadingStateChange?: LoadingStateChangeFunction;
    onSavedSuccessfully?: Function;
    onErrorsWhileSaving?: Function;
    schemaCacheEnabled?: boolean;
    schemaCacheMaxTimeSeconds?: number;
    schemaGlobalCacheMaxElements?: number;
    useFormDataInsteadOfPlainObject?: boolean;
    requiredIndicator?: string | React.ReactNode;
    noRefreshAfterSuccess?: boolean;
}
interface State {
    schema: FormFieldToRender[];
    errors: FormErrors;
    loading: boolean;
}
export declare class ItfApiForm extends React.Component<Props, State> implements RefToItfFormBuilderComponent {
    private itfFormBuilderRef;
    api: PublicItfFormBuilderComponentApi;
    state: {
        schema: never[];
        errors: {};
        loading: boolean;
    };
    private setApi;
    componentDidUpdate(): void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    private setLoading;
    fetchSchema(): Promise<FormFieldToRender[]>;
    private transAndFormat;
    private transPlainStr;
    isThereAnyError(formErrors: FormErrors): boolean;
    handleFormSubmit: (values: any) => Promise<void>;
    handleAnyFieldTouch: (field: any, ev: any) => void;
    render(): any;
}
export {};
