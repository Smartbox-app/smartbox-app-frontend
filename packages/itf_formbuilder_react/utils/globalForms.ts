import {PublicItfFormBuilderComponentApi, RefToItfFormBuilderComponent} from "../ItfFormBuilder";

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

export function registerGlobalForm(formId?: string, form?: RefToItfFormBuilderComponent|any, values?: any) {
    window.globalForms = window.globalForms || {};
    if (formId && form) {
        window.globalForms[formId] = {
            api: form.api,
            values: values ? values : form.state.values,
        };
    }
}

export function updateGlobalFormValues(formId: string, newValues: any) {
    window.globalForms = window.globalForms || {};
    if (window.globalForms[formId]) {
        window.globalForms[formId].values = newValues;
        if (typeof window.globalForms[formId].valueChangedClb === 'function') {
            // @ts-ignore
            window.globalForms[formId].valueChangedClb(newValues);
        }
    }
}

export function unregisterGlobalForm(formId: string) {
    window.globalForms = window.globalForms || {};
    if (window.globalForms[formId]) {
        window.globalForms[formId] = null as any;
        delete window['globalForms'][formId];
    }
}