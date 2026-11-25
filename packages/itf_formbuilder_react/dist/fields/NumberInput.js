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
function NumberInput(props) {
    var onChange = props.onChange, currentValue = props.currentValue, field = props.field, fieldHtmlId = props.fieldHtmlId, onFocus = props.onFocus, onBlur = props.onBlur;
    var placeholder = field.placeholder, readOnly = field.readOnly;
    var _a = field.options, isFloat = _a.isFloat, step = _a.step, min = _a.min, max = _a.max, type = _a.type;
    return (React.createElement("input", { type: type || 'number', readOnly: readOnly, placeholder: placeholder, value: Number.isNaN(currentValue) ? '' : currentValue, id: fieldHtmlId, onChange: eventTargetValueExtractor_1.eventTargetValueExtractor(onChange, 'value', function (val) {
            return val === '' ? NaN : Number(val);
        }), min: min, max: max, step: step ? step : isFloat === true ? 0.1 : 1, onFocus: onFocus, onBlur: onBlur }));
}
exports.NumberInput = NumberInput;
