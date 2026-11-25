"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createFileDragDropField = exports.formDataStrToRealValue = exports.defaultOptionsValidator = exports.defaultEmptyVal = void 0;
const formBuilder_1 = require("../../formBuilder");
function defaultEmptyVal(field) {
    return null; // This has no meaning, as Mutler will handle that
}
exports.defaultEmptyVal = defaultEmptyVal;
async function defaultOptionsValidator(field) { }
exports.defaultOptionsValidator = defaultOptionsValidator;
function formDataStrToRealValue(str, field) {
    return str; // This is not str - it should be FormData File if sent like this Or it doesn't even exists as Mutler takes it
}
exports.formDataStrToRealValue = formDataStrToRealValue;
function createFileDragDropField(field) {
    return Object.assign(Object.assign({}, field), { type: formBuilder_1.FormFieldType.FileDragDrop });
}
exports.createFileDragDropField = createFileDragDropField;
