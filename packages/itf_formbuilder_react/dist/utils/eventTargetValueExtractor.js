"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function eventTargetValueExtractor(onChange, valueFieldName, customVal) {
    if (valueFieldName === void 0) { valueFieldName = 'value'; }
    return function (e) { return onChange(typeof customVal === 'function' ? customVal(e.target[valueFieldName]) : e.target[valueFieldName]); };
}
exports.eventTargetValueExtractor = eventTargetValueExtractor;
