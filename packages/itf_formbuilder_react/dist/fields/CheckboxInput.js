"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var eventTargetValueExtractor_1 = require("../utils/eventTargetValueExtractor");
function CheckboxInput(props) {
    var onChange = props.onChange, currentValue = props.currentValue, field = props.field, fieldHtmlId = props.fieldHtmlId, onFocus = props.onFocus, onBlur = props.onBlur;
    return (React.createElement("input", { type: "checkbox", readOnly: field.readOnly, checked: currentValue, id: fieldHtmlId, onChange: eventTargetValueExtractor_1.eventTargetValueExtractor(onChange, 'checked'), onFocus: onFocus, onBlur: onBlur }));
}
exports.CheckboxInput = CheckboxInput;
