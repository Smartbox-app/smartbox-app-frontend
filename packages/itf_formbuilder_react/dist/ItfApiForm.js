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
var ItfFormBuilder_1 = require("./ItfFormBuilder");
var itfApiFormSchemaCache_1 = require("./utils/itfApiFormSchemaCache");
var format_1 = __importDefault(require("./utils/format"));
var globalForms_1 = require("./utils/globalForms");
var ItfApiForm = /** @class */ (function (_super) {
    __extends(ItfApiForm, _super);
    function ItfApiForm() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.itfFormBuilderRef = null;
        _this.api = null;
        _this.state = {
            schema: [],
            errors: {},
            loading: true,
        };
        _this.setLoading = function (loading) {
            _this.setState({
                loading: loading,
            });
            if (typeof _this.props.onLoadingStateChange === 'function') {
                _this.props.onLoadingStateChange(loading);
            }
        };
        _this.handleFormSubmit = function (values) { return __awaiter(_this, void 0, void 0, function () {
            var _a, sendFetcher, formId, onSavedSuccessfully, onErrorsWhileSaving, noRefreshAfterSuccess, sendDelay, ans, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, sendFetcher = _a.sendFetcher, formId = _a.formId, onSavedSuccessfully = _a.onSavedSuccessfully, onErrorsWhileSaving = _a.onErrorsWhileSaving, noRefreshAfterSuccess = _a.noRefreshAfterSuccess, sendDelay = _a.sendDelay;
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, Promise.resolve(sendFetcher(formId, values))];
                    case 2:
                        ans = _b.sent();
                        this.setState({
                            errors: typeof ans === 'object' &&
                                ans !== null &&
                                typeof ans.form_errors === 'object'
                                ? ans.form_errors
                                : {},
                        });
                        if (typeof ans === 'object' &&
                            ans !== null &&
                            ans.form_errors &&
                            this.isThereAnyError(ans.form_errors)) {
                            if (typeof onErrorsWhileSaving === 'function') {
                                onErrorsWhileSaving(ans.formErrors, formId);
                            }
                        }
                        else {
                            if (typeof onSavedSuccessfully === 'function') {
                                onSavedSuccessfully(ans, formId);
                            }
                            if (!noRefreshAfterSuccess)
                                this.componentDidMount();
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _b.sent();
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        _this.handleAnyFieldTouch = function (field, ev) {
            var _a;
            if (typeof _this.props.onTouch === 'function') {
                _this.props.onTouch(field, ev);
            }
            _this.setState({
                errors: __assign(__assign({}, _this.state.errors), (_a = {}, _a[field.id] = [], _a)),
            });
        };
        return _this;
    }
    ItfApiForm.prototype.setApi = function () {
        var _this = this;
        if (!this.api && this.itfFormBuilderRef) {
            this.api = __assign(__assign({}, this.itfFormBuilderRef.api), { resetInternalErrors: function () {
                    var errors = __assign({}, _this.state.errors);
                    for (var key in errors) {
                        errors[key] = [];
                    }
                    _this.setState({
                        errors: errors,
                    });
                    _this.itfFormBuilderRef.api.resetInternalErrors();
                }, resetAll: function () {
                    _this.api.resetInternalErrors();
                    _this.api.resetValues();
                } });
            if (this.props.registerAsGlobalForm) {
                globalForms_1.registerGlobalForm(this.props.formId, this, this.itfFormBuilderRef.state.values);
                if (typeof this.props.onFormGloballyRegistered === 'function') {
                    this.props.onFormGloballyRegistered(this.api);
                }
            }
        }
    };
    ItfApiForm.prototype.componentDidUpdate = function () {
        this.setApi();
    };
    ItfApiForm.prototype.componentDidMount = function () {
        var _this = this;
        this.setApi();
        this.setLoading(true);
        this.fetchSchema().then(function (schema) {
            _this.setState({
                schema: schema,
            });
            _this.setLoading(false);
        });
    };
    ItfApiForm.prototype.componentWillUnmount = function () {
        globalForms_1.unregisterGlobalForm(this.props.formId);
    };
    ItfApiForm.prototype.fetchSchema = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, formId, schemaFetcher, schemaMayBeDynamic, schemaCacheEnabled, schemaCacheMaxTimeSeconds, schemaGlobalCacheMaxElements, schemaFromCache, schema;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.props, formId = _a.formId, schemaFetcher = _a.schemaFetcher, schemaMayBeDynamic = _a.schemaMayBeDynamic;
                        schemaCacheEnabled = typeof this.props.schemaCacheEnabled === 'boolean'
                            ? this.props.schemaCacheEnabled
                            : true;
                        schemaCacheMaxTimeSeconds = this.props.schemaCacheMaxTimeSeconds || 360;
                        schemaGlobalCacheMaxElements = this.props.schemaGlobalCacheMaxElements || 50;
                        if (schemaCacheEnabled) {
                            if (schemaMayBeDynamic) {
                                console.warn("Warning: formId " + formId + " may have dynamic schema, but schemaCacheEnabled is enabled anyway! It may not download correct schema.");
                            }
                            schemaFromCache = itfApiFormSchemaCache_1.cacheGetAndCleanupOnlyThisFormIfNeeded(formId, schemaCacheMaxTimeSeconds);
                            if (schemaFromCache) {
                                return [2 /*return*/, schemaFromCache];
                            }
                        }
                        return [4 /*yield*/, Promise.resolve(schemaFetcher(formId))];
                    case 1:
                        schema = _b.sent();
                        if (!schema || !schema.push || schema.length === 0) {
                            throw new Error("Cannot fetch schema for formId " + formId + "! Response is not FormFieldToRender[] or is empty!");
                        }
                        if (schemaCacheEnabled) {
                            itfApiFormSchemaCache_1.cacheSetAndCleanupAllIfNeeded(formId, schema, schemaCacheMaxTimeSeconds, schemaGlobalCacheMaxElements);
                        }
                        return [2 /*return*/, schema];
                }
            });
        });
    };
    ItfApiForm.prototype.transAndFormat = function (obj) {
        return format_1.default.apply(void 0, __spreadArrays([this.transPlainStr(obj.messageWithPlaceholders)], obj.params));
    };
    ItfApiForm.prototype.transPlainStr = function (s) {
        var onTranslateString = this.props.onTranslateString;
        return typeof onTranslateString === 'function' ? onTranslateString(s) : s;
    };
    ItfApiForm.prototype.isThereAnyError = function (formErrors) {
        for (var key in formErrors) {
            if (formErrors[key].length > 0)
                return true;
        }
        return false;
    };
    ItfApiForm.prototype.render = function () {
        var _this = this;
        var _a = this.props, loadingInfo = _a.loadingInfo, sendDelay = _a.sendDelay, requiredIndicator = _a.requiredIndicator;
        var _b = this.state, loading = _b.loading, schema = _b.schema, errors = _b.errors;
        if (!schema || schema.length === 0) {
            return (loadingInfo || (React.createElement("p", { className: "loading-info" }, this.transPlainStr('Loading'))));
        }
        return (React.createElement(ItfFormBuilder_1.ItfFormBuilder, __assign({}, this.props, { ref: function (comp) {
                return (_this.itfFormBuilderRef = comp);
            }, sendDelay: sendDelay, formSchema: schema, onFormSubmit: this.handleFormSubmit, errors: errors, onTouch: this.handleAnyFieldTouch, requiredIndicator: requiredIndicator, onFormGloballyRegistered: undefined /* Disable, this is handled internally */ })));
    };
    return ItfApiForm;
}(React.Component));
exports.ItfApiForm = ItfApiForm;
