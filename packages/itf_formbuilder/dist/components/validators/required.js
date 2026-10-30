"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requiredValidator = void 0;
const formBuilder_1 = require("../../formBuilder");
const translatableError_1 = require("../utils/translatableError");
function requiredValidator() {
    return async (field) => {
        const f = field;
        if (!f.required === true)
            return;
        const defEmptyVal = formBuilder_1.FormBuilder.getFieldEmptyVal(f);
        if (f.value === defEmptyVal) {
            throw new translatableError_1.TranslatableError('Field required.');
        }
    };
}
exports.requiredValidator = requiredValidator;
