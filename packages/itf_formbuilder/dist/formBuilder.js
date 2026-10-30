"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FormBuilder = exports.FormFieldType = void 0;
const translatableError_1 = require("./components/utils/translatableError");
// To cheat Webpack. No, I cannot use dynamic require, as this will funckin' load .d.ts file...
const checkboxFile = __importStar(require("./components/fields/checkbox"));
const dateTimeFile = __importStar(require("./components/fields/dateTime"));
const numberFile = __importStar(require("./components/fields/number"));
const staticSelectFile = __importStar(require("./components/fields/staticSelect"));
const textareaFile = __importStar(require("./components/fields/textarea"));
const variablePlaceholderFile = __importStar(require("./components/fields/variablePlaceholder"));
const wysywigFile = __importStar(require("./components/fields/wysywig"));
const fileDragDropFile = __importStar(require("./components/fields/fileDragDrop"));
const groupStartFile = __importStar(require("./components/fields/groupStart"));
const groupEndFile = __importStar(require("./components/fields/groupEnd"));
const heaaderFile = __importStar(require("./components/fields/header"));
const custom = __importStar(require("./components/fields/custom"));
var FormFieldType;
(function (FormFieldType) {
    FormFieldType["Text"] = "text";
    FormFieldType["Number"] = "number";
    FormFieldType["Textarea"] = "textarea";
    FormFieldType["Wysywig"] = "wysywig";
    FormFieldType["Checkbox"] = "checkbox";
    FormFieldType["StaticSelect"] = "staticSelect";
    FormFieldType["DateTime"] = "dateTime";
    FormFieldType["Entity"] = "entity";
    FormFieldType["VariablePlaceholder"] = "variablePlaceholder";
    FormFieldType["FileDragDrop"] = "fileDragDrop";
    FormFieldType["GroupStart"] = "groupStart";
    FormFieldType["GroupEnd"] = "groupEnd";
    FormFieldType["Header"] = "header";
    FormFieldType["Custom"] = "custom";
})(FormFieldType = exports.FormFieldType || (exports.FormFieldType = {}));
var FormBuilderState;
(function (FormBuilderState) {
    FormBuilderState[FormBuilderState["Building"] = 0] = "Building";
    FormBuilderState[FormBuilderState["Built"] = 1] = "Built";
    FormBuilderState[FormBuilderState["LoadedVals"] = 2] = "LoadedVals";
    FormBuilderState[FormBuilderState["Validated"] = 3] = "Validated";
})(FormBuilderState || (FormBuilderState = {}));
function getBestPossibleError(e) {
    if (e instanceof translatableError_1.TranslatableError && e.getTranslatableObject) {
        return e.getTranslatableObject();
    }
    else {
        return {
            messageWithPlaceholders: e.message,
            messageCompiled: e.message,
            params: [],
        };
    }
}
class FormBuilder {
    constructor() {
        this.state = FormBuilderState.Building;
        this.fields = [];
        this.errors = {};
    }
    makeSureFormIsInState(expectedState) {
        if (expectedState !== this.state) {
            throw new Error(`Cannot perform this action on FormBuilder - it is in invalid state (expected ${expectedState}, but it is ${this.state}).`);
        }
    }
    static dynamicLoadFieldFile(field) {
        switch (field.type) {
            case FormFieldType.Text:
                return textareaFile;
            case FormFieldType.Number:
                return numberFile;
            case FormFieldType.Textarea:
                return textareaFile;
            case FormFieldType.Wysywig:
                return wysywigFile;
            case FormFieldType.Checkbox:
                return checkboxFile;
            case FormFieldType.StaticSelect:
                return staticSelectFile;
            case FormFieldType.DateTime:
                return dateTimeFile;
            case FormFieldType.VariablePlaceholder:
                return variablePlaceholderFile;
            case FormFieldType.FileDragDrop:
                return fileDragDropFile;
            case FormFieldType.GroupStart:
                return groupStartFile;
            case FormFieldType.GroupEnd:
                return groupEndFile;
            case FormFieldType.Header:
                return heaaderFile;
            case FormFieldType.Custom:
                return custom;
            default:
                throw new Error('To enable another type of field one needs to fill itf_formbuilder.FormBuilder.dynamicLoadFieldFile() method. Because of Webpack this is required to be done manually.');
        }
    }
    static getFieldEmptyVal(field) {
        return FormBuilder.dynamicLoadFieldFile(field).defaultEmptyVal(field);
    }
    appendField(field) {
        this.makeSureFormIsInState(FormBuilderState.Building);
        const prev = this.fields.find((one) => one.id === field.id);
        if (prev) {
            throw new Error(`Cannot create form with two fields with the same ID! ${field.id} has been used again.`);
        }
        let { descr, placeholder, value, required, readOnly, options, settings, validators, valueOnInactivity, visibilityAndActivity, } = field;
        // Assign default values if none are found
        if (typeof descr === 'undefined') {
            descr = '';
        }
        if (typeof placeholder === 'undefined') {
            placeholder = '';
        }
        if (typeof required === 'undefined') {
            required = false;
        }
        if (typeof readOnly === 'undefined') {
            readOnly = false;
        }
        if (typeof value === 'undefined' || value === null) {
            value = FormBuilder.getFieldEmptyVal(field);
        }
        if (typeof options === 'undefined') {
            options = {};
        }
        if (typeof settings === 'undefined') {
            settings = {};
        }
        if (typeof validators === 'undefined') {
            validators = [];
        }
        if (typeof valueOnInactivity === 'undefined') {
            valueOnInactivity = null;
        }
        this.fields.push(Object.assign(Object.assign({}, field), { descr,
            placeholder,
            value,
            required,
            readOnly,
            options,
            settings,
            validators,
            visibilityAndActivity,
            valueOnInactivity }));
        return this;
    }
    getJson() {
        this.makeSureFormIsInState(FormBuilderState.Built);
        return JSON.stringify(this.fields.map((field) => {
            const { id, title, type, descr, placeholder, value, options, required, readOnly, visibilityAndActivity, valueOnInactivity, } = field;
            return {
                descr,
                placeholder,
                id,
                title,
                type,
                value,
                options,
                required,
                readOnly,
                valueOnInactivity,
                visibilityAndActivity: visibilityAndActivity
                    ? visibilityAndActivity.toString()
                    : undefined,
            };
        }));
    }
    build() {
        this.makeSureFormIsInState(FormBuilderState.Building);
        this.state = FormBuilderState.Built;
        this.fields = this.fields; //Lol, not doing anything at all right now
        return this;
    }
    loadValues(valuesObj, isFormData = false) {
        this.makeSureFormIsInState(FormBuilderState.Built);
        this.state = FormBuilderState.LoadedVals;
        for (let key in valuesObj) {
            const field = this.fields.find((oneField) => oneField.id === key);
            if (!field)
                throw new Error('Error while loading form values. Values object has unknown key ' +
                    key);
            field.value = isFormData
                ? this.formDataFieldToRealVal(valuesObj[key], field)
                : valuesObj[key];
        }
        return this;
    }
    getVal(fieldId) {
        const field = this.fields.find((oneField) => oneField.id === fieldId);
        if (!field)
            throw new Error('Error while getting value of field. Unknown field id ' + fieldId);
        return field.value;
    }
    getAllVals() {
        return this.fields.reduce((prev, oneField) => {
            prev[oneField.id] = oneField.value;
            return prev;
        }, {});
    }
    addError(fieldId, error) {
        this.errors[fieldId] = this.errors[fieldId] || [];
        this.errors[fieldId].push(error);
    }
    async validateField(field) {
        if (field.doNotAutoValidateOptions !== true) {
            try {
                await Promise.resolve(FormBuilder.dynamicLoadFieldFile(field).defaultOptionsValidator(field));
            }
            catch (e) {
                this.addError(field.id, getBestPossibleError(e));
            }
        }
        if (field.validators &&
            field.validators.length &&
            field.validators.length > 0 &&
            (!this.errors[field.id] || this.errors[field.id].length === 0) // Do not check if there is an error anyway in default validator
        ) {
            for (let validator of field.validators) {
                try {
                    await Promise.resolve(validator(field));
                }
                catch (e) {
                    this.addError(field.id, getBestPossibleError(e));
                    break; // Only one
                }
            }
        }
    }
    async evalIsActive(field, allVals) {
        const { visibilityAndActivity } = field;
        if (!visibilityAndActivity)
            return true;
        return await Promise.resolve(visibilityAndActivity(allVals));
    }
    async validate() {
        this.makeSureFormIsInState(FormBuilderState.LoadedVals);
        this.state = FormBuilderState.Validated;
        this.errors = {};
        for (const field of this.fields.filter((one) => !one.visibilityAndActivity)) {
            await this.validateField(field);
        }
        const deactivableFields = this.fields.filter((one) => !!one.visibilityAndActivity);
        if (deactivableFields.length > 0) {
            const vals = this.getAllVals();
            for (const field of deactivableFields) {
                const { valueOnInactivity } = field;
                if (await this.evalIsActive(field, vals)) {
                    await this.validateField(field);
                }
                else {
                    // Not the best place to do it, but the only async one, so that we know evalIsActive.
                    field.value = valueOnInactivity;
                }
            }
        }
        return !this.hasAnyErrors();
    }
    hasAnyErrors() {
        return Object.keys(this.errors).length > 0;
    }
    getErrors() {
        this.makeSureFormIsInState(FormBuilderState.Validated);
        return this.errors;
    }
    formDataFieldToRealVal(str, field) {
        return FormBuilder.dynamicLoadFieldFile(field).formDataStrToRealValue(str, field);
    }
}
exports.FormBuilder = FormBuilder;
