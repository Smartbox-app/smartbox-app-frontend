"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCheckboxField = exports.formDataStrToRealValue = exports.defaultOptionsValidator = exports.defaultEmptyVal = void 0;
const formBuilder_1 = require("../../formBuilder");
const required_1 = require("../validators/required");
const translatableError_1 = require("../utils/translatableError");
function defaultEmptyVal(field) {
    return false;
}
exports.defaultEmptyVal = defaultEmptyVal;
async function defaultOptionsValidator(field) {
    const { value } = field;
    if (typeof value !== 'boolean') {
        throw new translatableError_1.TranslatableError('Invalid type of value: {0} expected.', 'boolean');
    }
}
exports.defaultOptionsValidator = defaultOptionsValidator;
function formDataStrToRealValue(str, field) {
    switch (str) {
        case 'true':
            return true;
        case 'false':
            return false;
        default:
            throw new translatableError_1.TranslatableError('Invalid type of value: {0} expected.', 'boolean');
    }
}
exports.formDataStrToRealValue = formDataStrToRealValue;
function createCheckboxField(field) {
    if (field.required === true) {
        field.validators = field.validators || [];
        field.validators.push(required_1.requiredValidator());
    }
    return Object.assign(Object.assign({}, field), { type: formBuilder_1.FormFieldType.Checkbox });
}
exports.createCheckboxField = createCheckboxField;
