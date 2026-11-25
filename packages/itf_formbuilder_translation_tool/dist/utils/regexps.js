"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isTsFileRegEx = /\.tsx?$/i;
const isDTsFileRegEx = /\.d\.ts?$/i;
function isTsFile(fn) {
    return ((!!fn.match(isTsFileRegEx))
        &&
            (!fn.match(isDTsFileRegEx)));
}
exports.isTsFile = isTsFile;
const isNodeModulesDirRegEx = /[\\/]node_modules[\\/]?$/i;
function isNodeModulesDir(fn) {
    return (!!fn.match(isNodeModulesDirRegEx));
}
exports.isNodeModulesDir = isNodeModulesDir;
const validTranslatableErrorsRegExps = [
    /new TranslatableError\([ \t\r\n]*?'(.*?)'[),\r\n]/gm,
    /new TranslatableError\([ \t\r\n]*?"(.*?)"[),\r\n]/gm,
    /getTranslatableError\([ \t\r\n]*?'(.*?)'[),\r\n]/gm,
    /getTranslatableError\([ \t\r\n]*?"(.*?)"[),\r\n]/gm,
];
const invalidTranslatableErrorsRegExps = [
    /.*?new TranslatableError\([ \t\r\n]*?[^'"]*[ \t\r\n,]*?,/gm,
    /.*?new getTranslatableError\([ \t\r\n]*?[^'"]*[ \t\r\n,]*?,/gm,
];
function getTranslatableErrorStrings(str) {
    let founds = [];
    for (const regex of validTranslatableErrorsRegExps) {
        let m;
        while ((m = regex.exec(str)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            founds = [...founds, m[1]];
        }
    }
    return founds;
}
exports.getTranslatableErrorStrings = getTranslatableErrorStrings;
function getInvalidTranslatableErrorUsageLines(str, fn) {
    let founds = [];
    for (const regex of invalidTranslatableErrorsRegExps) {
        let m;
        while ((m = regex.exec(str)) !== null) {
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            console.log();
            founds = [
                ...founds,
                `File: ${fn}, line: ${m[0]}`,
            ];
        }
    }
    return founds;
}
exports.getInvalidTranslatableErrorUsageLines = getInvalidTranslatableErrorUsageLines;
const typesDependencyRegExp = /"([a-zA-Z0-9-_\.]+-types)": "git\+[^"]+-types/;
function findTypesDependencyName(packageJson) {
    const match = packageJson.match(typesDependencyRegExp);
    return match ? match[1] : null;
}
exports.findTypesDependencyName = findTypesDependencyName;
//# sourceMappingURL=regexps.js.map