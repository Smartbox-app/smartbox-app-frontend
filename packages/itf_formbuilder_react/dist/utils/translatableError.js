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
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var format_1 = __importDefault(require("./format"));
var TranslatableError = /** @class */ (function (_super) {
    __extends(TranslatableError, _super);
    function TranslatableError(messageWithPlaceholders) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        var _this = _super.call(this, format_1.default.apply(void 0, __spreadArrays([messageWithPlaceholders], params))) || this;
        _this.messageWithPlaceholders = messageWithPlaceholders;
        _this.params = [];
        _this.params = params;
        return _this;
    }
    TranslatableError.prototype.getTranslatableObject = function () {
        var _a = this, params = _a.params, messageWithPlaceholders = _a.messageWithPlaceholders;
        return { params: params, messageWithPlaceholders: messageWithPlaceholders, messageCompiled: format_1.default.apply(void 0, __spreadArrays([messageWithPlaceholders], params)) };
    };
    return TranslatableError;
}(Error));
exports.TranslatableError = TranslatableError;
function getTranslatableError(messageWithPlaceholders) {
    var params = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        params[_i - 1] = arguments[_i];
    }
    return (new (TranslatableError.bind.apply(TranslatableError, __spreadArrays([void 0, messageWithPlaceholders], params)))()).getTranslatableObject();
}
exports.getTranslatableError = getTranslatableError;
