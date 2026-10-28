"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHeaderField = exports.formDataStrToRealValue = exports.defaultOptionsValidator = exports.defaultEmptyVal = void 0;
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
function createHeaderField(fieldId, title = "", visibilityAndActivity, valueOnInactivity) {
    const field = {
        id: fieldId,
        title: title,
        visibilityAndActivity: visibilityAndActivity,
        valueOnInactivity: valueOnInactivity,
    };
    return Object.assign(Object.assign({}, field), { type: formBuilder_1.FormFieldType.Header });
}
exports.createHeaderField = createHeaderField;
