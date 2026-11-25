"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStaticSelectField = exports.defaultOptionsValidator = exports.formDataStrToRealValue = exports.defaultEmptyVal = void 0;
const formBuilder_1 = require("../../formBuilder");
const translatableError_1 = require("../utils/translatableError");
const validators_1 = require("../validators");
function defaultEmptyVal(field) {
    const { options } = field;
    const multipleChoices = options ? options.multipleChoices : false;
    if (multipleChoices === true) {
        return [];
    }
    return null;
}
exports.defaultEmptyVal = defaultEmptyVal;
function formDataStrToRealValue(str, field) {
    if (field.options && field.options.multipleChoices) {
        return str.split(',').map((s) => s.trim());
    }
    else {
        return str;
    }
}
exports.formDataStrToRealValue = formDataStrToRealValue;
async function defaultOptionsValidator(field) {
    const { value, options } = field;
    const { multipleChoices, possibleValues, creatable } = options;
    if (multipleChoices !== true) {
        if (['string', 'number'].indexOf(typeof value) === -1 && value !== null) {
            throw new translatableError_1.TranslatableError('Invalid type of value: {0} expected.', 'string or number');
        }
        if (!creatable &&
            value !== null &&
            !Array.isArray(possibleValues) &&
            !possibleValues.hasOwnProperty(value)) {
            throw new translatableError_1.TranslatableError('Invalid option: {0}.', value);
        }
        else if (!creatable &&
            value !== null &&
            Array.isArray(possibleValues) &&
            !possibleValues.find((o) => o.value === value) &&
            !possibleValues.hasOwnProperty(value)) {
            throw new translatableError_1.TranslatableError('Invalid option: {0}.', value);
        }
    }
    else {
        if (typeof value.push !== 'undefined' &&
            value.length !== 0 &&
            ['string', 'number'].indexOf(typeof value[0]) === -1) {
            throw new translatableError_1.TranslatableError('Invalid type of value: {0} expected.', 'array of strings or array of numbers');
        }
        for (let val of value) {
            if (!creatable &&
                value !== null &&
                !Array.isArray(possibleValues) &&
                !possibleValues.hasOwnProperty(val)) {
                throw new translatableError_1.TranslatableError('Invalid option: {0}.', value);
            }
            else if (!creatable &&
                value !== null &&
                Array.isArray(possibleValues) &&
                !possibleValues.find((o) => o.value === val) &&
                !possibleValues.hasOwnProperty(value)) {
                throw new translatableError_1.TranslatableError('Invalid option: {0}.', value);
            }
        }
    }
}
exports.defaultOptionsValidator = defaultOptionsValidator;
function createStaticSelectField(field) {
    if (field.required === true) {
        field.validators = field.validators || [];
        field.validators.push(validators_1.requiredValidator());
    }
    return Object.assign(Object.assign({}, field), { type: formBuilder_1.FormFieldType.StaticSelect });
}
exports.createStaticSelectField = createStaticSelectField;
