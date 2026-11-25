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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = __importStar(require("react"));
var itf_formbuilder_1 = require("itf_formbuilder");
var format_1 = __importDefault(require("./utils/format"));
var NumberInput_1 = require("./fields/NumberInput");
var TextInput_1 = require("./fields/TextInput");
var CheckboxInput_1 = require("./fields/CheckboxInput");
var DateTimeInput_1 = require("./fields/DateTimeInput");
var Textarea_1 = require("./fields/Textarea");
var StaticSelectBasedOnHtmlSelect_1 = require("./fields/StaticSelectBasedOnHtmlSelect");
var StaticSelectBasedOnReactSelect_1 = require("./fields/StaticSelectBasedOnReactSelect");
var Wysywig_1 = require("./fields/Wysywig");
var globalForms_1 = require("./utils/globalForms");
var FileDragDrop_1 = __importDefault(require("./fields/FileDragDrop"));
var ItfFormBuilder = /** @class */ (function (_super) {
    __extends(ItfFormBuilder, _super);
    function ItfFormBuilder(props) {
        var _this = _super.call(this, props) || this;
        _this.groupActive = false;
        _this.groupCache = [];
        _this.api = {
            send: function () { return _this.handleFormSubmit(null); },
            resetAll: function () {
                _this.api.resetInternalErrors();
                _this.api.resetValues();
            },
            resetValues: function () {
                var values = __assign({}, _this.state.values);
                var _loop_1 = function (key) {
                    var field = _this.props.formSchema.find(function (field) { return field.id === key; });
                    if (field) {
                        values[key] = field.value;
                    }
                };
                for (var key in values) {
                    _loop_1(key);
                }
                _this.setState({
                    values: values,
                });
            },
            setValue: function (field, value) {
                _this.changeFunctions[field](value);
            },
            setValues: function (fields) {
                _this.globalChange(fields);
            },
            getValue: function (fieldId) {
                return _this.state.values[fieldId];
            },
            resetInternalErrors: function () {
                var errors = __assign({}, _this.state.errors);
                for (var key in errors) {
                    errors[key] = [];
                }
                _this.setState({
                    errors: errors,
                });
            },
            focusField: function (fieldId) {
                var field = document.querySelector('#' + _this.genFieldId(fieldId));
                if (field && field.focus) {
                    field.focus();
                }
            },
        };
        _this.transPlainStr = function (s) {
            var onTranslateString = _this.props.onTranslateString;
            return typeof onTranslateString === 'function' ? onTranslateString(s) : s;
        };
        _this.renderSingleFullField = function (field, errors) {
            var onRenderFullField = _this.props.onRenderFullField;
            var requiredIndicator = _this.props.requiredIndicator;
            var descr = field.descr, title = field.title, id = field.id, options = field.options;
            if (_this.state.inactiveFields.indexOf(id) > -1) {
                return null;
            }
            var onChange = _this.changeFunctions[field.id];
            var onFocus = _this.focusFunctions[field.id];
            var onBlur = _this.blurFunctions[field.id];
            var currentValue = _this.state.values[field.id];
            var fieldHtmlId = _this.genFieldId(field);
            if (field.type === 'groupStart') {
                if (_this.groupActive === false) {
                    _this.groupCache = [];
                    _this.groupActive = true;
                }
                return null;
            }
            if (field.type === 'groupEnd') {
                _this.groupActive = false;
                return (React.createElement("div", { className: "fields-group " + (_this.groupCache.length === 0 ? 'empty' : '') }, _this.groupCache));
            }
            if (typeof onRenderFullField === 'function') {
                var customFullField = onRenderFullField(field, errors, fieldHtmlId, currentValue, onChange, onFocus, onBlur);
                if (customFullField) {
                    if (_this.groupActive) {
                        _this.groupCache.push(customFullField);
                        return null;
                    }
                    else
                        return customFullField;
                }
            }
            if (field.type === itf_formbuilder_1.FormFieldType.Checkbox) {
                return _this.renderCheckboxField(field, errors, fieldHtmlId, currentValue, onChange, onFocus, onBlur);
            }
            return (React.createElement("div", { className: _this.buildClassNameForContainer(field, errors), key: fieldHtmlId },
                React.createElement("label", { htmlFor: fieldHtmlId },
                    React.createElement("p", { className: "form-field-title" },
                        _this.transPlainStr(title),
                        field.required && requiredIndicator),
                    descr && (!options || !options.descriptionBelow) && (React.createElement("p", { className: "form-field-description" }, _this.transPlainStr(descr)))),
                _this.renderFieldBasedOnType(field, fieldHtmlId, currentValue, onChange, onFocus, onBlur),
                descr && options && options.descriptionBelow && (React.createElement("p", { className: "form-field-description" }, _this.transPlainStr(descr))),
                _this.renderErrors(errors)));
        };
        _this.handleFormSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
            var values, _a, onFormSubmit, onValidateField, formSchema, useFormDataInsteadOfPlainObject, sendDelay;
            var _this = this;
            return __generator(this, function (_b) {
                if (e) {
                    e.preventDefault();
                }
                values = this.state.values;
                _a = this.props, onFormSubmit = _a.onFormSubmit, onValidateField = _a.onValidateField, formSchema = _a.formSchema, useFormDataInsteadOfPlainObject = _a.useFormDataInsteadOfPlainObject, sendDelay = _a.sendDelay;
                setTimeout(function () {
                    _this.setState({
                        loading: true,
                    }, function () { return __awaiter(_this, void 0, void 0, function () {
                        var errors, hasAnyError, _i, formSchema_1, field, result;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, , 2, 3]);
                                    errors = __assign({}, this.state.errors);
                                    hasAnyError = false;
                                    // Custom front-end validation
                                    if (typeof onValidateField === 'function') {
                                        for (_i = 0, formSchema_1 = formSchema; _i < formSchema_1.length; _i++) {
                                            field = formSchema_1[_i];
                                            result = onValidateField(__assign(__assign({}, field), { value: values[field.id] }));
                                            if (typeof result === 'string') {
                                                hasAnyError = true;
                                                errors[field.id].push({
                                                    messageWithPlaceholders: result,
                                                    messageCompiled: result,
                                                    params: [],
                                                });
                                            }
                                            else if (result &&
                                                result.messageWithPlaceholders &&
                                                result.messageCompiled &&
                                                result.params) {
                                                hasAnyError = true;
                                                errors[field.id].push(result);
                                            }
                                        }
                                    }
                                    if (hasAnyError) {
                                        this.setState({
                                            errors: errors,
                                        });
                                        return [2 /*return*/];
                                    }
                                    // Send
                                    return [4 /*yield*/, Promise.resolve(onFormSubmit(useFormDataInsteadOfPlainObject
                                            ? this.plainObjectToFormData(values)
                                            : values))];
                                case 1:
                                    // Send
                                    _a.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    this.setState({
                                        loading: false,
                                    });
                                    return [7 /*endfinally*/];
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); });
                }, sendDelay || 0);
                return [2 /*return*/];
            });
        }); };
        _this.getSubmitButton = function () {
            var submitButton = _this.props.submitButton;
            var loading = _this.state.loading;
            if (typeof submitButton === 'function') {
                return submitButton(loading);
            }
            else if (submitButton) {
                return submitButton;
            }
            else
                return React.createElement("button", { type: "submit" }, _this.transPlainStr('Accept'));
        };
        _this.state = {
            loading: false,
            inactiveFields: [],
            values: _this.props.formSchema.reduce(function (prev, oneField) {
                prev[oneField.id] = oneField.value;
                return prev;
            }, {}),
            errors: _this.props.formSchema.reduce(function (prev, oneField) {
                prev[oneField.id] = [];
                return prev;
            }, {}),
        };
        _this.globalChange = function (fields) {
            _this.setState({
                values: __assign(__assign({}, _this.state.values), fields),
            }, function () {
                _this.checkFieldsInactivity();
                var _a = _this.props, registerAsGlobalForm = _a.registerAsGlobalForm, enableLiveValuesOfGlobalForm = _a.enableLiveValuesOfGlobalForm, formId = _a.formId;
                var values = _this.state.values;
                if (registerAsGlobalForm && enableLiveValuesOfGlobalForm !== false) {
                    globalForms_1.updateGlobalFormValues(formId, values);
                }
            });
        };
        _this.changeFunctions = _this.props.formSchema.reduce(function (prev, oneField) {
            prev[oneField.id] = function (currentValue) {
                var _a;
                if (typeof _this.props.onTouch === 'function') {
                    _this.props.onTouch(oneField, currentValue);
                }
                _this.setState({
                    values: __assign(__assign({}, _this.state.values), (_a = {}, _a[oneField.id] = currentValue, _a)),
                }, function () {
                    _this.checkFieldsInactivity();
                    var _a = _this.props, registerAsGlobalForm = _a.registerAsGlobalForm, enableLiveValuesOfGlobalForm = _a.enableLiveValuesOfGlobalForm, formId = _a.formId;
                    var values = _this.state.values;
                    if (registerAsGlobalForm &&
                        enableLiveValuesOfGlobalForm !== false) {
                        globalForms_1.updateGlobalFormValues(formId, values);
                    }
                });
            };
            return prev;
        }, {});
        var _a = _this.props, onFocus = _a.onFocus, onBlur = _a.onBlur;
        _this.activityCheckFunctions = _this.props.formSchema.reduce(function (prev, oneField) {
            if (oneField.visibilityAndActivity) {
                prev[oneField.id] = new Function('return ' + oneField.visibilityAndActivity)();
            }
            return prev;
        }, {});
        _this.focusFunctions = _this.props.formSchema.reduce(function (prev, oneField) {
            prev[oneField.id] =
                typeof onFocus === 'function'
                    ? function (ev) {
                        if (typeof onFocus === 'function') {
                            onFocus(oneField, ev);
                        }
                    }
                    : undefined;
            return prev;
        }, {});
        _this.blurFunctions = _this.props.formSchema.reduce(function (prev, oneField) {
            prev[oneField.id] =
                typeof onBlur === 'function'
                    ? function (ev) {
                        if (typeof onBlur === 'function') {
                            onBlur(oneField, ev);
                        }
                    }
                    : undefined;
            return prev;
        }, {});
        _this.randNum = Math.ceil(Math.random() * 10000 + +new Date());
        return _this;
    }
    ItfFormBuilder.prototype.componentDidMount = function () {
        this.checkFieldsInactivity();
        if (this.props.registerAsGlobalForm) {
            globalForms_1.registerGlobalForm(this.props.formId, this);
            if (typeof this.props.onFormGloballyRegistered === 'function') {
                this.props.onFormGloballyRegistered(this.api);
            }
        }
    };
    ItfFormBuilder.prototype.componentDidUpdate = function (prevProps) {
        var _a = this.props, noRefreshAfterSuccess = _a.noRefreshAfterSuccess, formSchema = _a.formSchema;
        if (prevProps.formSchema !== formSchema) {
            if (!noRefreshAfterSuccess) {
                this.setState({
                    values: formSchema.reduce(function (prev, oneField) {
                        prev[oneField.id] = oneField.value;
                        return prev;
                    }, {}),
                });
            }
        }
    };
    ItfFormBuilder.prototype.componentWillUnmount = function () {
        globalForms_1.unregisterGlobalForm(this.props.formId);
    };
    ItfFormBuilder.prototype.transAndFormat = function (obj) {
        return format_1.default.apply(void 0, __spreadArrays([this.transPlainStr(obj.messageWithPlaceholders)], obj.params));
    };
    ItfFormBuilder.prototype.renderErrors = function (errors) {
        var _this = this;
        if (errors.length === 0)
            return null;
        var lis = errors.map(function (translatableError, index) { return (React.createElement("li", { key: index }, typeof translatableError === 'string'
            ? _this.transPlainStr(translatableError)
            : _this.transAndFormat(translatableError))); });
        return React.createElement("ul", { className: "form-field-errors" }, lis);
    };
    ItfFormBuilder.prototype.genFieldId = function (fieldOrFieldId) {
        return "f_" + (typeof fieldOrFieldId === 'string' ? fieldOrFieldId : fieldOrFieldId.id) + "_" + this.randNum;
    };
    ItfFormBuilder.prototype.passDataToPropsOfStandardInput = function (Component, field, fieldHtmlId, currentValue, onChange, onFocus, onBlur) {
        var transPlainStr = this.transPlainStr;
        var thirdPartyComponents = this.props.thirdPartyComponents;
        return (React.createElement(Component, __assign({}, {
            field: field,
            fieldHtmlId: fieldHtmlId,
            currentValue: currentValue,
            onChange: onChange,
            onFocus: onFocus,
            onBlur: onBlur,
            transPlainStr: transPlainStr,
            thirdPartyComponents: thirdPartyComponents,
        })));
    };
    ItfFormBuilder.prototype.renderFieldBasedOnType = function (field, fieldHtmlId, currentValue, onChange, onFocus, onBlur) {
        var onRenderCustomFieldByType = this.props.onRenderCustomFieldByType;
        switch (field.type) {
            case itf_formbuilder_1.FormFieldType.Number:
                return this.passDataToPropsOfStandardInput(NumberInput_1.NumberInput, field, fieldHtmlId, currentValue, onChange, onFocus, onBlur);
            case itf_formbuilder_1.FormFieldType.Text:
                return this.passDataToPropsOfStandardInput(TextInput_1.TextInput, field, fieldHtmlId, currentValue, onChange, onFocus, onBlur);
            case itf_formbuilder_1.FormFieldType.Checkbox:
                return this.passDataToPropsOfStandardInput(CheckboxInput_1.CheckboxInput, field, fieldHtmlId, currentValue, onChange, onFocus, onBlur);
            case itf_formbuilder_1.FormFieldType.DateTime:
                return this.passDataToPropsOfStandardInput(DateTimeInput_1.DateTimeInput, field, fieldHtmlId, currentValue, onChange, onFocus, onBlur);
            case itf_formbuilder_1.FormFieldType.Textarea:
                return this.passDataToPropsOfStandardInput(Textarea_1.Textarea, field, fieldHtmlId, currentValue, onChange, onFocus, onBlur);
            case itf_formbuilder_1.FormFieldType.StaticSelect:
                return this.passDataToPropsOfStandardInput(field.options && field.options.useReactSelectComponent === true
                    ? StaticSelectBasedOnReactSelect_1.StaticSelectBasedOnReactSelect
                    : StaticSelectBasedOnHtmlSelect_1.StaticSelectBasedOnHtmlSelect, field, fieldHtmlId, currentValue, onChange, onFocus, onBlur);
            case itf_formbuilder_1.FormFieldType.Wysywig:
                return this.passDataToPropsOfStandardInput(Wysywig_1.Wysywig, field, fieldHtmlId, currentValue, onChange, onFocus, onBlur);
            case itf_formbuilder_1.FormFieldType.FileDragDrop:
                return this.passDataToPropsOfStandardInput(FileDragDrop_1.default, field, fieldHtmlId, currentValue, onChange, onFocus, onBlur);
            case itf_formbuilder_1.FormFieldType.VariablePlaceholder:
                return null; // We don't render it. Sender function should fill it.
            default:
                if (typeof onRenderCustomFieldByType === 'function') {
                    return onRenderCustomFieldByType(field, fieldHtmlId, currentValue, onChange, onFocus, onBlur);
                }
                else {
                    console.error("Cannot render this (" + field.type + ") type of field!");
                    return (React.createElement("p", { style: { color: 'red', fontWeight: 'bold' } }, "('Sorry, cannot render this form field type!')"));
                }
        }
    };
    ItfFormBuilder.prototype.buildClassNameForContainer = function (field, errors) {
        return "form-field" + (errors.length > 0 ? ' error' : '') + " field-type-" + field.type + " " + (field.required ? 'field-required' : 'field-optional');
    };
    ItfFormBuilder.prototype.renderCheckboxField = function (field, errors, fieldHtmlId, currentValue, onChange, onFocus, onBlur) {
        var title = field.title, descr = field.descr;
        var requiredIndicator = this.props.requiredIndicator;
        return (React.createElement("div", { className: this.buildClassNameForContainer(field, errors), key: fieldHtmlId },
            React.createElement("div", { className: "checkbox" },
                this.renderFieldBasedOnType(field, fieldHtmlId, currentValue, onChange, onFocus, onBlur),
                React.createElement("label", { htmlFor: fieldHtmlId },
                    React.createElement("p", { className: "form-field-title" },
                        this.transPlainStr(title),
                        field.required && requiredIndicator))),
            descr && (React.createElement("p", { className: "form-field-description" }, this.transPlainStr(descr))),
            this.renderErrors(errors)));
    };
    ItfFormBuilder.prototype.plainObjectToFormData = function (obj) {
        var fd = new FormData();
        for (var key in obj) {
            fd.append(key, obj[key]);
        }
        return fd;
    };
    ItfFormBuilder.prototype.deepErrorsCopy = function (internalErrors, customErrors) {
        var result = {};
        for (var key in internalErrors) {
            if (customErrors.hasOwnProperty(key)) {
                result[key] = __spreadArrays(internalErrors[key], customErrors[key]);
            }
            else {
                result[key] = internalErrors[key];
            }
        }
        for (var key in customErrors) {
            if (!internalErrors.hasOwnProperty(key)) {
                result[key] = customErrors[key];
            }
        }
        return result;
    };
    ItfFormBuilder.prototype.checkFieldsInactivity = function () {
        return __awaiter(this, void 0, void 0, function () {
            var inactiveFields, _a, _b, _i, fieldId, ans;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (Object.keys(this.activityCheckFunctions).length === 0)
                            return [2 /*return*/];
                        inactiveFields = [];
                        _a = [];
                        for (_b in this.activityCheckFunctions)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 1;
                    case 1:
                        if (!(_i < _a.length)) return [3 /*break*/, 5];
                        fieldId = _a[_i];
                        return [4 /*yield*/, Promise.resolve(this.activityCheckFunctions[fieldId](this.state.values))];
                    case 2:
                        ans = _c.sent();
                        return [4 /*yield*/, Promise.resolve(this.activityCheckFunctions[fieldId](this.state.values))];
                    case 3:
                        if (!(_c.sent())) {
                            inactiveFields.push(fieldId);
                        }
                        _c.label = 4;
                    case 4:
                        _i++;
                        return [3 /*break*/, 1];
                    case 5:
                        this.setState({
                            inactiveFields: inactiveFields,
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    ItfFormBuilder.prototype.render = function () {
        var _this = this;
        var _a = this.props, formSchema = _a.formSchema, submitButton = _a.submitButton, loadingInfo = _a.loadingInfo, loadingInfoAboveContent = _a.loadingInfoAboveContent, formId = _a.formId;
        var _b = this.state, internalErrors = _b.errors, loading = _b.loading;
        var customErrors = this.props.errors;
        var errors = this.deepErrorsCopy(internalErrors, customErrors || {});
        if (loading && loadingInfoAboveContent !== true) {
            return (loadingInfo || (React.createElement("p", { className: "loading-info" }, this.transPlainStr('Loading'))));
        }
        return (React.createElement("form", { action: "#", onSubmit: this.handleFormSubmit, id: "form_" + formId },
            loading &&
                loadingInfoAboveContent &&
                (loadingInfo || (React.createElement("p", { className: "loading-info" }, this.transPlainStr('Loading')))),
            formSchema.map(function (oneField) {
                return _this.renderSingleFullField(oneField, errors[oneField.id]);
            }),
            React.createElement("div", { className: "form-buttons" }, this.getSubmitButton())));
    };
    return ItfFormBuilder;
}(React.Component));
exports.ItfFormBuilder = ItfFormBuilder;
