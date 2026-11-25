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
var pseudoArrayToArray_1 = require("../utils/pseudoArrayToArray");
function StaticSelectBasedOnHtmlSelect(props) {
    var onChange = props.onChange, currentValue = props.currentValue, field = props.field, fieldHtmlId = props.fieldHtmlId, onFocus = props.onFocus, onBlur = props.onBlur, transPlainStr = props.transPlainStr;
    var _a = field.options, possibleValues = _a.possibleValues, multipleChoices = _a.multipleChoices, translateValues = _a.translateValues;
    var readOnly = field.readOnly;
    var options;
    options = Object.keys(possibleValues).map(function (key) { return (React.createElement("option", { value: key, key: key }, translateValues
        ? transPlainStr(possibleValues[key])
        : possibleValues[key])); });
    var handleOnChange = multipleChoices === true
        ? function (event) {
            var values = pseudoArrayToArray_1.pseudoArrayToArray(event.target.querySelectorAll('option'))
                .filter(function (option) { return option.selected; })
                .map(function (option) { return option.value; });
            onChange(values);
        }
        : eventTargetValueExtractor_1.eventTargetValueExtractor(onChange);
    return (React.createElement("select", { multiple: multipleChoices, value: currentValue === null ? undefined : currentValue, id: fieldHtmlId, onChange: handleOnChange, onFocus: onFocus, onBlur: onBlur, disabled: readOnly },
        currentValue === null && (React.createElement("option", { value: null }, transPlainStr('Select...'))),
        options));
}
exports.StaticSelectBasedOnHtmlSelect = StaticSelectBasedOnHtmlSelect;
