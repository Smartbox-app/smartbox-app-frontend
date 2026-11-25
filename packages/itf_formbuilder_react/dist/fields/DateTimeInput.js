"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
function checkAndGetFlatpickr(thirdPartyComponents) {
    if (thirdPartyComponents && thirdPartyComponents.flatpickr)
        return thirdPartyComponents.flatpickr;
    console.error("###########\nUsing DateTimeInput with ItfFormBuilder requires flatpickr! You must include it in your project and pass to ItfFormBuilder as thirdPartyComponents.flatpickr.\n\n# The simplest is by using with Webpack/bundler:\n    \nyarn add flatpickr\nor\nnpm i -S flatpickr\n\n# Then:\n\nimport flatpickr from \"flatpickr\";\nimport 'flatpickr/dist/flatpickr.min.css';\nimport 'flatpickr/dist/themes/airbnb.css';  // Check out other cool Themes: https://flatpickr.js.org/themes/\nimport {Polish} from \"flatpickr/dist/l10n/pl\";\nflatpickr.localize(Polish);\nflatpickr.defaultConfig.time_24hr = true;\n\n# Then pass it like this:\n\n<ItfFormBuilder/ItfApiForm\n    {/* ... */}\n    thirdPartyComponents={{flatpickr}}\n/>\n\n\n#");
    throw new Error("Using DateTimeInput with ItfFormBuilder requires flatpickr! You must include it in your project and pass to ItfFormBuilder as thirdPartyComponents.flatpickr.");
}
var DateTimeInput = /** @class */ (function (_super) {
    __extends(DateTimeInput, _super);
    function DateTimeInput(props) {
        var _this = _super.call(this, props) || this;
        _this.getMode = function () {
            var field = _this.props.field;
            var multiple = field.options.multiple;
            if (multiple)
                return "multiple";
            return "single";
        };
        _this.flatpickr = checkAndGetFlatpickr(props.thirdPartyComponents);
        return _this;
    }
    DateTimeInput.prototype.componentDidMount = function () {
        var _a = this.props, onChange = _a.onChange, currentValue = _a.currentValue, field = _a.field, fieldHtmlId = _a.fieldHtmlId;
        var _b = field.options, min = _b.min, max = _b.max, includeHours = _b.includeHours, multiple = _b.multiple;
        var mode = this.getMode();
        this.flatpickr("#" + fieldHtmlId, {
            mode: mode,
            minDate: min,
            maxDate: max,
            defaultDate: currentValue,
            enableTime: includeHours,
            onChange: function (selectedDates, dateStr, instance) {
                if (mode === "multiple") {
                    onChange(selectedDates);
                }
                else
                    onChange(selectedDates[0]);
            }
        });
    };
    DateTimeInput.prototype.render = function () {
        var _a = this.props, onChange = _a.onChange, currentValue = _a.currentValue, field = _a.field, fieldHtmlId = _a.fieldHtmlId, onFocus = _a.onFocus, onBlur = _a.onBlur;
        var placeholder = field.placeholder;
        var _b = field.options, min = _b.min, max = _b.max, includeHours = _b.includeHours;
        return (React.createElement("input", { type: "datetime-local", defaultValue: new Date(currentValue).toLocaleString(), placeholder: placeholder, readOnly: true, id: fieldHtmlId, onFocus: onFocus, onBlur: onBlur, min: min ? new Date(min).toISOString() : undefined, max: max ? new Date(max).toISOString() : undefined }));
    };
    return DateTimeInput;
}(React.Component));
exports.DateTimeInput = DateTimeInput;
