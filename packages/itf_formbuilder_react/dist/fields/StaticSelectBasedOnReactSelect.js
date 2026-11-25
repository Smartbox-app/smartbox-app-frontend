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
function checkAndGetReactSelect(thirdPartyComponents, creatable) {
    if (thirdPartyComponents &&
        thirdPartyComponents.ReactSelect &&
        thirdPartyComponents.ReactCreatableSelect)
        return creatable
            ? thirdPartyComponents.ReactCreatableSelect
            : thirdPartyComponents.ReactSelect;
    console.error("###########\nUsing StaticSelect with options.useReactSelectComponent set to true with ItfFormBuilder requires React Select! You must include it in your project and pass to ItfFormBuilder as thirdPartyComponents.ReactSelect and as thirdPartyComponents.ReactCreatableSelect.\n\n# The simplest is by using with Webpack/bundler:\n    \nyarn add react-select\nor\nnpm i -S react-select\n\n# To include types:\n\nyarn add @types/react-select --dev\nor\nnpm i -D @types/react-select\n\n# Then:\n\nimport ReactSelect from 'react-select'\nimport ReactCreatableSelect from 'react-select/creatable'\n\n# Then pass it like this:\n\n<ItfFormBuilder/ItfApiForm\n    {/* ... */}\n    thirdPartyComponents={{ReactSelect, ReactCreatableSelect}}\n/>\n\n\n#");
    throw new Error('Using StaticSelect with options.useReactSelectComponent set to true with ItfFormBuilder requires React Select! You must include it in your project and pass to ItfFormBuilder as thirdPartyComponents.ReactSelect.');
}
function StaticSelectBasedOnReactSelect(props) {
    var onChange = props.onChange, currentValue = props.currentValue, field = props.field, fieldHtmlId = props.fieldHtmlId, onFocus = props.onFocus, onBlur = props.onBlur, transPlainStr = props.transPlainStr;
    var _a = field.options, possibleValues = _a.possibleValues, multipleChoices = _a.multipleChoices, creatable = _a.creatable, translateValues = _a.translateValues, translateCreatedValue = _a.translateCreatedValue;
    var readOnly = field.readOnly;
    var ReactSelect = checkAndGetReactSelect(props.thirdPartyComponents, creatable);
    var options = [];
    if (Array.isArray(possibleValues)) {
        if (possibleValues.length > 0) {
            options = possibleValues.map(function (val) {
                if (typeof val === 'object') {
                    return {
                        value: val.value,
                        label: translateValues ? transPlainStr(val.name) : val.name,
                    };
                }
                else {
                    return {
                        value: val,
                        label: translateValues ? transPlainStr(val) : val,
                    };
                }
            });
        }
    }
    else {
        options = Object.keys(possibleValues).map(function (key) { return ({
            value: key,
            label: translateValues
                ? transPlainStr(possibleValues[key])
                : possibleValues[key],
        }); });
    }
    var handleChange = function (vals) {
        var realVals = multipleChoices
            ? vals === null
                ? []
                : vals.map(function (v) { return v.value; })
            : typeof vals !== 'undefined' && vals !== null && vals !== ''
                ? vals.value
                : null;
        onChange(realVals);
    };
    var oneRealValToOneReactSelectVal = function (value) {
        var found = Object.keys(possibleValues).find(function (v) { return v === value; });
        return {
            value: value,
            label: found
                ? translateValues
                    ? transPlainStr(possibleValues[found])
                    : possibleValues[found]
                : translateCreatedValue
                    ? transPlainStr(value)
                    : transPlainStr(value),
        };
    };
    var getValue = function () {
        if (currentValue === null ||
            (multipleChoices && currentValue.length === 0))
            return null;
        return multipleChoices
            ? currentValue.map(oneRealValToOneReactSelectVal)
            : oneRealValToOneReactSelectVal(currentValue);
    };
    return (React.createElement(ReactSelect, { options: options, onBlur: onBlur, onFocus: onFocus, onChange: handleChange, isDisabled: readOnly, noOptionsMessage: function () { return transPlainStr('Nothing found'); }, placeholder: field.placeholder || transPlainStr('Select...'), value: getValue(), isMulti: multipleChoices, isClearable: !field.required, id: fieldHtmlId }));
}
exports.StaticSelectBasedOnReactSelect = StaticSelectBasedOnReactSelect;
