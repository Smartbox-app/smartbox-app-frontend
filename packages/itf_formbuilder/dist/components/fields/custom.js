"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCustomField = exports.formDataStrToRealValue = exports.defaultOptionsValidator = exports.defaultEmptyVal = void 0;
const formBuilder_1 = require("../../formBuilder");
function defaultEmptyVal(field) {
    return null;
}
exports.defaultEmptyVal = defaultEmptyVal;
async function defaultOptionsValidator(field) { }
exports.defaultOptionsValidator = defaultOptionsValidator;
function formDataStrToRealValue(str, field) {
    return null;
}
exports.formDataStrToRealValue = formDataStrToRealValue;
function createCustomField(fieldId, value, title = "") {
    const field = {
        id: fieldId,
        title: title,
        value: value
    };
    return Object.assign(Object.assign({}, field), { type: formBuilder_1.FormFieldType.Custom });
}
exports.createCustomField = createCustomField;
