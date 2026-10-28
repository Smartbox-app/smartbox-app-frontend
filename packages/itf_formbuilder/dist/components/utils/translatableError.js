"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTranslatableError = exports.TranslatableError = void 0;
const format_1 = __importDefault(require("./format"));
class TranslatableError extends Error {
    constructor(messageWithPlaceholders, ...params) {
        super(format_1.default(messageWithPlaceholders, ...params));
        this.messageWithPlaceholders = messageWithPlaceholders;
        this.params = [];
        this.params = params;
        Object.setPrototypeOf(this, TranslatableError.prototype); // Hack required to make it work!
    }
    getTranslatableObject() {
        const { params, messageWithPlaceholders } = this;
        return { params, messageWithPlaceholders, messageCompiled: format_1.default(messageWithPlaceholders, ...params) };
    }
}
exports.TranslatableError = TranslatableError;
function getTranslatableError(messageWithPlaceholders, ...params) {
    return (new TranslatableError(messageWithPlaceholders, ...params)).getTranslatableObject();
}
exports.getTranslatableError = getTranslatableError;
