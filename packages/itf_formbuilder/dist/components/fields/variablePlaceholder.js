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
exports.createVarField = exports.formDataStrToRealValue = exports.defaultOptionsValidator = exports.defaultEmptyVal = exports.ExpectedVarType = void 0;
const formBuilder_1 = require("../../formBuilder");
const translatableError_1 = require("../utils/translatableError");
const validators_1 = require("../validators");
const checkbox = __importStar(require("./checkbox"));
var ExpectedVarType;
(function (ExpectedVarType) {
    ExpectedVarType[ExpectedVarType["any"] = 0] = "any";
    ExpectedVarType[ExpectedVarType["number"] = 1] = "number";
    ExpectedVarType[ExpectedVarType["string"] = 2] = "string";
    ExpectedVarType[ExpectedVarType["boolean"] = 3] = "boolean";
    ExpectedVarType[ExpectedVarType["object"] = 4] = "object";
    ExpectedVarType[ExpectedVarType["arrayOfStrings"] = 5] = "arrayOfStrings";
    ExpectedVarType[ExpectedVarType["arrayOfNumbers"] = 6] = "arrayOfNumbers";
    ExpectedVarType[ExpectedVarType["arrayOfObjects"] = 7] = "arrayOfObjects";
    ExpectedVarType[ExpectedVarType["arrayOfAny"] = 8] = "arrayOfAny";
})(ExpectedVarType = exports.ExpectedVarType || (exports.ExpectedVarType = {}));
function defaultEmptyVal(field) {
    return null;
}
exports.defaultEmptyVal = defaultEmptyVal;
async function defaultOptionsValidator(field) {
    const { value, settings } = field;
    const { varType } = settings;
    switch (varType) {
        case ExpectedVarType.number:
            if (typeof value !== 'number') {
                throw new translatableError_1.TranslatableError('Invalid type of value: {0} expected.', 'number');
            }
            break;
        case ExpectedVarType.string:
            if (typeof value !== 'string') {
                throw new translatableError_1.TranslatableError('Invalid type of value: {0} expected.', 'string');
            }
            break;
        case ExpectedVarType.boolean:
            if (typeof value !== 'boolean') {
                throw new translatableError_1.TranslatableError('Invalid type of value: {0} expected.', 'boolean');
            }
            break;
        case ExpectedVarType.object:
            if (typeof value !== 'object') {
                throw new translatableError_1.TranslatableError('Invalid type of value: {0} expected.', 'object');
            }
            break;
        case ExpectedVarType.arrayOfStrings:
            if (!value.find || value.find((v) => typeof v !== 'string')) {
                throw new translatableError_1.TranslatableError('Invalid type of value: {0} expected.', 'array of strings');
            }
            break;
        case ExpectedVarType.arrayOfNumbers:
            if (!value.find || value.find((v) => typeof v !== 'number')) {
                throw new translatableError_1.TranslatableError('Invalid type of value: {0} expected.', 'array of numbers');
            }
            break;
        case ExpectedVarType.arrayOfObjects:
            if (!value.find || value.find((v) => typeof v !== 'object')) {
                throw new translatableError_1.TranslatableError('Invalid type of value: {0} expected.', 'array of objects');
            }
            break;
        case ExpectedVarType.arrayOfAny:
            if (!value.find) {
                throw new translatableError_1.TranslatableError('Invalid type of value: {0} expected.', 'any array');
            }
            break;
    }
}
exports.defaultOptionsValidator = defaultOptionsValidator;
function formDataStrToRealValue(str, field) {
    const { settings } = field;
    const { varType } = settings;
    switch (varType) {
        case ExpectedVarType.number:
            return Number(str);
        case ExpectedVarType.string:
            return str;
        case ExpectedVarType.boolean:
            return checkbox.formDataStrToRealValue(str, field);
        case ExpectedVarType.arrayOfStrings:
            return str.split(',').map(s => s.trim());
        case ExpectedVarType.arrayOfNumbers:
            return str.split(',').map(s => Number(s.trim()));
        default:
            throw new translatableError_1.TranslatableError('Cannot decode this type of data when using FormData.');
    }
}
exports.formDataStrToRealValue = formDataStrToRealValue;
function createVarField(fieldId, varType, fieldOpts) {
    const field = Object.assign(Object.assign({}, fieldOpts), { id: fieldId, title: '', settings: {
            varType,
        } });
    if (field.required === true) {
        field.validators = field.validators || [];
        field.validators.push(validators_1.requiredValidator());
    }
    return Object.assign(Object.assign({}, field), { type: formBuilder_1.FormFieldType.VariablePlaceholder });
}
exports.createVarField = createVarField;
