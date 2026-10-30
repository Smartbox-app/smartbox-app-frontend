"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function format(s) {
    var params = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        params[_i - 1] = arguments[_i];
    }
    return s.replace(/{(\d+)}/g, function (match, number) {
        return typeof params[number] != 'undefined'
            ? params[number]
            : match;
    });
}
exports.default = format;
;
