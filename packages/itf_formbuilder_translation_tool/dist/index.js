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
const files_1 = require("./utils/files");
const path = require("path");
const fs = require("fs");
const regexps_1 = require("./utils/regexps");
let debugLevel = 'log';
const DEBUG_LEVELS = ['log', 'info', 'warn', 'error'];
let warnsCount = 0;
let errorsCount = 0;
const KNOWN_INVALID_FILE_ENDINGS_IGNORE = [
    'itf_formbuilder/components/utils/translatableError.ts',
    'itf_formbuilder_react/utils/translatableError.ts',
];
function endsWith(fullStr, partStr, ignoreCase = true) {
    if (ignoreCase) {
        fullStr = fullStr.toLowerCase();
        partStr = partStr.toLowerCase();
    }
    return fullStr.substring(fullStr.length - partStr.length) === partStr;
}
function normalizePath(path, dirSeparator = '/') {
    return path.replace(/[\\/]/g, dirSeparator);
}
function log(level, info, ...params) {
    const thisLogLevel = DEBUG_LEVELS.indexOf(level);
    const desiredMinLogLevel = DEBUG_LEVELS.indexOf(debugLevel);
    if (thisLogLevel < desiredMinLogLevel) {
        return;
    }
    let prefix = '';
    switch (level) {
        case "warn":
            prefix = '! ';
            warnsCount++;
            break;
        case "error":
            prefix = '!!! ';
            errorsCount++;
            break;
    }
    console[level](prefix + info, ...params);
}
function exitWithReason(reason, reasonLevel = 'error') {
    log(reasonLevel, reason);
    process.exit();
}
function checkConfigFile(config) {
    if (typeof config.paths !== 'object' || !config.paths.length) {
        exitWithReason('Config invalid - *paths* missing or incorrect.');
        return false;
    }
    if (['undefined', 'boolean'].indexOf(typeof config.excludeLibraryItself) === -1) {
        exitWithReason('Config invalid - *excludeLibraryItself* incorrect.');
        return false;
    }
    if (['undefined', 'boolean'].indexOf(typeof config.includeApiErrorCodesFromTypes) === -1) {
        exitWithReason('Config invalid - *includeErrorTypes* incorrect.');
        return false;
    }
    if (typeof config.debugLevel === 'undefined') {
        config.debugLevel = 'warn';
    }
    if (['log', 'info', 'warn'].indexOf(config.debugLevel) === -1) {
        exitWithReason('Config invalid - *debugLevel* may only be default or "log" or "info" or "warn".');
        return false;
    }
    debugLevel = config.debugLevel;
    if (typeof config.output !== 'string') {
        exitWithReason('Config invalid - *output* missing or incorrect.');
        return false;
    }
    if (typeof config.langs !== 'object' || config.langs.length < 1) {
        exitWithReason('Config invalid - *langs* missing or empty array. It you are upgrading remember to change itfformbuilder.json and add *langs* array with languages to translate to. For example: "langs": ["en"].');
        return false;
    }
    return true;
}
function sortTranslations(lang, output) {
    return __awaiter(this, void 0, void 0, function* () {
        let currentTranslations = {};
        try {
            currentTranslations = yield files_1.loadJsonFile(output);
        }
        catch (e) {
        }
        log("log", 'Rearranging object as needed...');
        const allKeysSorted = Object.keys(currentTranslations[lang])
            .sort();
        const newObj = {};
        for (const key of allKeysSorted) {
            newObj[key] = currentTranslations[lang][key];
        }
        currentTranslations[lang] = newObj;
        ;
        yield files_1.saveJsonFile(output, currentTranslations);
    });
}
function processAllTranslations(lang, foundsOk, output) {
    return __awaiter(this, void 0, void 0, function* () {
        let currentTranslations = {};
        const currentHas = (key) => currentTranslations[lang].hasOwnProperty(key);
        const foundHas = (key) => foundsOk.indexOf(key) > -1;
        const addOne = (key) => {
            currentTranslations[lang] = currentTranslations[lang] || {};
            if (!currentHas(key)) {
                log("warn", 'Adding translation', key, 'lang', lang);
                currentTranslations[lang][key] = key;
            }
        };
        try {
            currentTranslations = yield files_1.loadJsonFile(output);
        }
        catch (e) {
        }
        foundsOk.forEach(addOne);
        yield files_1.saveJsonFile(output, currentTranslations);
        for (const key in currentTranslations[lang]) {
            if (key !== '_API_ERROR_CODES_' && !foundHas(key)) {
                log("warn", 'Looks like translation is no longer to be found (outdated?)', key);
            }
        }
        log("info", 'Total number of translations', 'In file', Object.keys(currentTranslations[lang]).length, 'Found in code', foundsOk.length, 'for lang', lang);
    });
}
function processErrorTypesTranslations(lang, foundsOk, output) {
    return __awaiter(this, void 0, void 0, function* () {
        let currentTranslations = {};
        const currentHas = (value, typeAlias) => currentTranslations[lang]._API_ERROR_CODES_ && Object.entries(currentTranslations[lang]._API_ERROR_CODES_).some(one => {
            const [valueInOne, dataInOne] = one;
            return Number(valueInOne) === value && dataInOne.__type_alias_do_not_touch === typeAlias;
        });
        const foundHas = (value, typeAlias) => foundsOk.some(one => one.value === value && one.typeAlias === typeAlias);
        const addOne = (value, typeAlias) => {
            currentTranslations[lang] = currentTranslations[lang] || {
                _API_ERROR_CODES_: {},
            };
            currentTranslations[lang]._API_ERROR_CODES_ = currentTranslations[lang]._API_ERROR_CODES_ || {};
            if (!currentHas(value, typeAlias)) {
                log("warn", 'Adding translation of type', typeAlias, `(${value})`, 'lang', lang);
                currentTranslations[lang]._API_ERROR_CODES_[value] = {
                    text: `@@@@@@@@@@@@@@@TODO: Translate ${typeAlias}!`,
                    __type_alias_do_not_touch: typeAlias,
                };
            }
        };
        try {
            currentTranslations = yield files_1.loadJsonFile(output);
        }
        catch (e) {
        }
        foundsOk.forEach(one => addOne(one.value, one.typeAlias));
        yield files_1.saveJsonFile(output, currentTranslations);
        for (const value in currentTranslations[lang]._API_ERROR_CODES_) {
            if (!foundHas(Number(value), currentTranslations[lang]._API_ERROR_CODES_[value].__type_alias_do_not_touch)) {
                log("warn", 'Looks like translation is no longer to be found (outdated?)', currentTranslations[lang]._API_ERROR_CODES_[value].__type_alias_do_not_touch, `(${value})`);
            }
        }
        log("info", 'Total number of type translations', 'In file', Object.keys(currentTranslations[lang]._API_ERROR_CODES_).length, 'Found in code', foundsOk.length, 'for lang', lang);
    });
}
function upgradeAndAutoMigrate(output, config) {
    return __awaiter(this, void 0, void 0, function* () {
        {
            let currentTranslations;
            try {
                currentTranslations = yield files_1.loadJsonFile(output);
            }
            catch (e) {
            }
            if (Object.values(currentTranslations).every((something) => typeof something === 'string')) {
                log("warn", 'Auto migrating flat translation file to multi-languages');
                currentTranslations = {
                    [config.langs[0]]: currentTranslations,
                };
                yield files_1.saveJsonFile(output, currentTranslations);
            }
        }
    });
}
function enumToValueAndAlias(theEnum, enumName = 'ApiErrorCode') {
    return Object.entries(theEnum)
        .filter(one => !Number.isNaN(Number(one[0])))
        .map(one => {
        const [value, typeAlias] = one;
        return { value: Number(value), typeAlias: `${enumName}.${typeAlias}` };
    });
}
function loadApiErrorCodes(currentDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const packageJsonFn = path.join(currentDir, 'package.json');
        let packageJson;
        try {
            packageJson = yield files_1.loadUtf8File(packageJsonFn);
        }
        catch (e) {
            log('error', 'Cannot load package.json to find the types!', packageJsonFn);
            exitWithReason('Cannot load package.json to find the types!');
        }
        const typesDependencyName = regexps_1.findTypesDependencyName(packageJson);
        if (typesDependencyName === null || !typesDependencyName) {
            exitWithReason('Cannot find types dependency repository name! Make sure it is in package.json under dependencies, like `"my-project-types": "git+......-types",` or disable includeApiErrorCodesFromTypes in config.');
        }
        const apiErrorCodesFile = path.join(currentDir, 'node_modules', typesDependencyName, 'dist/apiMessages/errorCodes.js');
        try {
            fs.accessSync(apiErrorCodesFile);
        }
        catch (e) {
            log('error', 'Cannot find ApiErrorCode file! Searching at', apiErrorCodesFile);
            exitWithReason('Cannot find ApiErrorCode file!');
        }
        const theEnum = require(apiErrorCodesFile).ApiErrorCode;
        return theEnum;
    });
}
(() => __awaiter(void 0, void 0, void 0, function* () {
    const currentDir = process.cwd();
    log("info", 'Current dir', currentDir);
    let config;
    try {
        config = yield files_1.loadJsonFile(path.join(currentDir, 'itfformbuilder.json'));
        log("info", 'Current config', config);
    }
    catch (e) {
        return exitWithReason('Cannot find itfformbuilder.json configuration file or it is invalid JSON.');
    }
    if (!checkConfigFile(config)) {
        return;
    }
    let { paths, output } = config;
    const { excludeLibraryItself, langs, includeApiErrorCodesFromTypes } = config;
    output = path.join(currentDir, output);
    yield files_1.prepareFileIfDoesNotExist(output);
    yield upgradeAndAutoMigrate(output, config);
    if (excludeLibraryItself !== true) {
        paths.push('node_modules/itf_formbuilder');
        paths.push('node_modules/itf_formbuilder_react');
    }
    paths = paths
        .map(dir => path.join(currentDir, dir))
        .filter(dir => fs.existsSync(dir));
    log("info", 'Please wait scanning directories...', paths);
    let files = [];
    for (const dir of paths) {
        files = [
            ...files,
            ...(yield files_1.readdir(dir))
                .filter(regexps_1.isTsFile),
        ];
    }
    log("info", 'Found .tsx? files', files.length);
    let foundsOk = [];
    let foundsError = [];
    for (const file of files) {
        if (KNOWN_INVALID_FILE_ENDINGS_IGNORE.some(oneIgnore => (endsWith(normalizePath(file), normalizePath(oneIgnore))))) {
            log("info", 'Ignoring known invalid file used by system', file);
            continue;
        }
        const str = yield files_1.loadUtf8File(file);
        foundsOk = [...foundsOk, ...regexps_1.getTranslatableErrorStrings(str)];
        foundsError = [...foundsError, ...regexps_1.getInvalidTranslatableErrorUsageLines(str, file)];
    }
    for (const errorLine of foundsError) {
        log("error", 'Invalid usage of translatable errors found! First parameter should always be constant string!', errorLine);
    }
    foundsOk = [...(new Set(foundsOk))];
    for (const lang of langs) {
        yield processAllTranslations(lang, foundsOk, output);
    }
    const loadedApiErrorCodes = enumToValueAndAlias(yield loadApiErrorCodes(currentDir));
    if (includeApiErrorCodesFromTypes) {
        for (const lang of langs) {
            yield processErrorTypesTranslations(lang, loadedApiErrorCodes, output);
        }
    }
    for (const lang of langs) {
        yield sortTranslations(lang, output);
    }
    const lastInfoLevel = errorsCount > 0 ? "error" : (warnsCount > 0 ? "warn" : "info");
    log(lastInfoLevel, '-------------- Process finished --------------', errorsCount, 'errors', warnsCount, 'warnings.');
}))();
//# sourceMappingURL=index.js.map