"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function registerGlobalForm(formId, form, values) {
    window.globalForms = window.globalForms || {};
    if (formId && form) {
        window.globalForms[formId] = {
            api: form.api,
            values: values ? values : form.state.values,
        };
    }
}
exports.registerGlobalForm = registerGlobalForm;
function updateGlobalFormValues(formId, newValues) {
    window.globalForms = window.globalForms || {};
    if (window.globalForms[formId]) {
        window.globalForms[formId].values = newValues;
        if (typeof window.globalForms[formId].valueChangedClb === 'function') {
            // @ts-ignore
            window.globalForms[formId].valueChangedClb(newValues);
        }
    }
}
exports.updateGlobalFormValues = updateGlobalFormValues;
function unregisterGlobalForm(formId) {
    window.globalForms = window.globalForms || {};
    if (window.globalForms[formId]) {
        window.globalForms[formId] = null;
        delete window['globalForms'][formId];
    }
}
exports.unregisterGlobalForm = unregisterGlobalForm;
