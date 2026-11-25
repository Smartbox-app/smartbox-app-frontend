import { PublicItfFormBuilderComponentApi, RefToItfFormBuilderComponent } from "../ItfFormBuilder";
export interface GlobalFormsData {
    [formId: string]: {
        api: PublicItfFormBuilderComponentApi;
        values: {
            [id: string]: any;
        };
        valueChangedClb?: (newValues: any) => any;
    };
}
declare global {
    interface Window {
        globalForms: GlobalFormsData;
    }
}
export declare function registerGlobalForm(formId?: string, form?: RefToItfFormBuilderComponent | any, values?: any): void;
export declare function updateGlobalFormValues(formId: string, newValues: any): void;
export declare function unregisterGlobalForm(formId: string): void;
