"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createGroupEndField = exports.formDataStrToRealValue = exports.defaultOptionsValidator = exports.defaultEmptyVal = void 0;
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
function createGroupEndField(id) {
    const field = {
        id,
        title: ""
    };
    return Object.assign(Object.assign({}, field), { type: formBuilder_1.FormFieldType.GroupEnd });
}
exports.createGroupEndField = createGroupEndField;
