"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWysywigField = exports.defaultOptionsValidator = exports.formDataStrToRealValue = exports.defaultEmptyVal = void 0;
const formBuilder_1 = require("../../formBuilder");
const translatableError_1 = require("../utils/translatableError");
const validators_1 = require("../validators");
function defaultEmptyVal(field) {
    return '';
}
exports.defaultEmptyVal = defaultEmptyVal;
function formDataStrToRealValue(str, field) {
    return str;
}
exports.formDataStrToRealValue = formDataStrToRealValue;
async function defaultOptionsValidator(field) {
    const { value, options } = field;
    const { minLength, maxLength } = options;
    if (typeof value !== 'string') {
        throw new translatableError_1.TranslatableError('Invalid type of value: {0} expected.', 'string');
    }
    if (typeof minLength === 'number') {
        if (value.length < minLength) {
            throw new translatableError_1.TranslatableError('Value too short (min. {0})', minLength);
        }
    }
    if (typeof maxLength === 'number') {
        if (value.length > maxLength) {
            throw new translatableError_1.TranslatableError('Value too long (max. {0})', maxLength);
        }
    }
}
exports.defaultOptionsValidator = defaultOptionsValidator;
function createWysywigField(field) {
    if (field.required === true) {
        field.validators = field.validators || [];
        field.validators.push(validators_1.requiredValidator());
    }
    return Object.assign(Object.assign({}, field), { type: formBuilder_1.FormFieldType.Wysywig });
}
exports.createWysywigField = createWysywigField;
