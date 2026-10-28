"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function format(s, ...params) {
    return s.replace(/{(\d+)}/g, function (match, number) {
        return typeof params[number] != 'undefined'
            ? params[number]
            : match;
    });
}
exports.default = format;
;
