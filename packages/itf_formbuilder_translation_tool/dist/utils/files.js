"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const util = require("util");
const fs = require("fs");
const path = require("path");
const regexps_1 = require("./regexps");
function loadUtf8File(fn) {
    return __awaiter(this, void 0, void 0, function* () {
        return util.promisify(fs.readFile)(fn, {
            encoding: 'utf8',
        });
    });
}
exports.loadUtf8File = loadUtf8File;
function loadJsonFile(fn) {
    return __awaiter(this, void 0, void 0, function* () {
        return JSON.parse(yield loadUtf8File(fn));
    });
}
exports.loadJsonFile = loadJsonFile;
function saveUtf8File(fn, data) {
    return __awaiter(this, void 0, void 0, function* () {
        util.promisify(fs.writeFile)(fn, data, {
            encoding: 'utf8',
        });
    });
}
exports.saveUtf8File = saveUtf8File;
function prepareFileIfDoesNotExist(fn, defaultEmptyData = '{}') {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            fs.accessSync(fn, fs.constants.F_OK);
        }
        catch (e) {
            console.log('Translation file does not exist? Creating it.', fn);
            yield saveUtf8File(fn, defaultEmptyData);
        }
    });
}
exports.prepareFileIfDoesNotExist = prepareFileIfDoesNotExist;
function saveJsonFile(fn, data) {
    return __awaiter(this, void 0, void 0, function* () {
        yield saveUtf8File(fn, JSON.stringify(data, null, 2));
    });
}
exports.saveJsonFile = saveJsonFile;
function readdir(dir) {
    return __awaiter(this, void 0, void 0, function* () {
        let files = (yield util.promisify(fs.readdir)(dir))
            .map(fn => path.join(dir, fn))
            .filter(fn => !regexps_1.isNodeModulesDir(fn));
        for (const fn of files) {
            if ((yield util.promisify(fs.stat)(fn)).isDirectory()) {
                files = [
                    ...files,
                    ...yield readdir(fn),
                ];
            }
        }
        return files;
    });
}
exports.readdir = readdir;
//# sourceMappingURL=files.js.map