"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNumberField = exports.defaultOptionsValidator = exports.formDataStrToRealValue = exports.defaultEmptyVal = void 0;
const formBuilder_1 = require("../../formBuilder");
const required_1 = require("../validators/required");
const translatableError_1 = require("../utils/translatableError");
function defaultEmptyVal(field) {
    return field &&
        field.settings &&
        typeof field.settings.defaultEmptyVal !== 'undefined'
        ? field.settings.defaultEmptyVal
        : 0;
}
exports.defaultEmptyVal = defaultEmptyVal;
function formDataStrToRealValue(str, field) {
    return Number(str);
}
exports.formDataStrToRealValue = formDataStrToRealValue;
async function defaultOptionsValidator(field) {
    const { value, options } = field;
    if (field.required && (typeof value !== 'number' || Number.isNaN(value))) {
        throw new translatableError_1.TranslatableError('Invalid type of value: {0} expected.', 'number');
    }
    if (options) {
        const { min, max } = options;
        if (typeof min === 'number') {
            if (value < min) {
                throw new translatableError_1.TranslatableError('Value too low. Min. {0}.', min);
            }
        }
        if (typeof max === 'number') {
            if (value > max) {
                throw new translatableError_1.TranslatableError('Value too high. Max. {0}.', max);
            }
        }
    }
}
exports.defaultOptionsValidator = defaultOptionsValidator;
function createNumberField(field) {
    if (field.required === true) {
        field.validators = field.validators || [];
        field.validators.push(required_1.requiredValidator());
    }
    return Object.assign(Object.assign({}, field), { type: formBuilder_1.FormFieldType.Number });
}
exports.createNumberField = createNumberField;
