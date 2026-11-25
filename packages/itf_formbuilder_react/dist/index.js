"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var globalForms_1 = require("./utils/globalForms");
globalForms_1.registerGlobalForm();
__export(require("./ItfFormBuilder"));
__export(require("./ItfApiForm"));
__export(require("./utils/translatableError"));
