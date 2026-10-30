"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDateTimeField = exports.defaultOptionsValidator = exports.formDataStrToRealValue = exports.defaultEmptyVal = void 0;
const formBuilder_1 = require("../../formBuilder");
const translatableError_1 = require("../utils/translatableError");
const validators_1 = require("../validators");
function defaultEmptyVal(field) {
    const { options } = field;
    const multiple = options ? options.multiple : false;
    if (multiple === true) {
        return [];
    }
    return field && field.settings && field.settings.defaultEmptyVal
        ? field.settings.defaultEmptyVal
        : null;
}
exports.defaultEmptyVal = defaultEmptyVal;
function formDataStrToRealValue(str, field) {
    if (field.options && field.options.multiple) {
        return str.split(',').map((s) => new Date(s));
    }
    return new Date(str);
}
exports.formDataStrToRealValue = formDataStrToRealValue;
function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}
async function defaultOptionsValidator(field) {
    field.value =
        field.value === defaultEmptyVal(field)
            ? defaultEmptyVal(field)
            : field.options.multiple
                ? field.value.map((d) => new Date(d))
                : new Date(field.value);
    const { value, options } = field;
    const { min, max, multiple } = options;
    if (multiple) {
        if (value === null || typeof value.push !== 'function') {
            throw new translatableError_1.TranslatableError('Invalid type of value: {0} expected.', 'array of Dates');
        }
        for (const date of value) {
            if (!isValidDate(date)) {
                throw new translatableError_1.TranslatableError('Invalid type of value: {0} expected.', 'array of Dates');
            }
            if (min && isValidDate(min) && +date < +min) {
                throw new translatableError_1.TranslatableError('Date too low. Min. {0}.', min);
            }
            if (max && isValidDate(max) && +date > +max) {
                throw new translatableError_1.TranslatableError('Date too high. Max. {0}.', max);
            }
        }
    }
    else {
        if (!isValidDate(value) && value !== null) {
            throw new translatableError_1.TranslatableError('Invalid type of value: {0} expected.', 'Date or null');
        }
        if (min && isValidDate(min) && value !== null) {
            if (+value < +min) {
                throw new translatableError_1.TranslatableError('Date too low. Min. {0}.', min);
            }
        }
        if (max && isValidDate(max) && value !== null) {
            if (+value > +max) {
                throw new translatableError_1.TranslatableError('Date too high. Max. {0}.', max);
            }
        }
    }
}
exports.defaultOptionsValidator = defaultOptionsValidator;
function createDateTimeField(field) {
    if (field.required === true) {
        field.validators = field.validators || [];
        field.validators.push(validators_1.requiredValidator());
    }
    return Object.assign(Object.assign({}, field), { type: formBuilder_1.FormFieldType.DateTime });
}
exports.createDateTimeField = createDateTimeField;
//@TODO: Add always default transformer
