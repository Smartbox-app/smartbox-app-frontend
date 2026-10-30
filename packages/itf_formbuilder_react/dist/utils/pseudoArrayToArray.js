"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function pseudoArrayToArray(pseudoAr) {
    var ar = [];
    for (var _i = 0, pseudoAr_1 = pseudoAr; _i < pseudoAr_1.length; _i++) {
        var el = pseudoAr_1[_i];
        ar.push(el);
    }
    return ar;
}
exports.pseudoArrayToArray = pseudoArrayToArray;
