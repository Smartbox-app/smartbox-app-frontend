"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGroupStartField = exports.formDataStrToRealValue = exports.defaultOptionsValidator = exports.defaultEmptyVal = void 0;
const formBuilder_1 = require("../../formBuilder");
function defaultEmptyVal(field) {
    return null;
}
exports.defaultEmptyVal = defaultEmptyVal;
async function defaultOptionsValidator(field) { }
exports.defaultOptionsValidator = defaultOptionsValidator;
function formDataStrToRealValue() {
    return null;
}
exports.formDataStrToRealValue = formDataStrToRealValue;
function createGroupStartField(id) {
    const field = {
        id,
        title: ""
    };
    return Object.assign(Object.assign({}, field), { type: formBuilder_1.FormFieldType.GroupStart });
}
exports.createGroupStartField = createGroupStartField;
