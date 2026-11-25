import {loadJsonFile, loadUtf8File, prepareFileIfDoesNotExist, readdir, saveJsonFile} from "./utils/files";
import * as path from "path";
import * as fs from "fs";
import {
    findTypesDependencyName,
    getInvalidTranslatableErrorUsageLines,
    getTranslatableErrorStrings,
    isTsFile
} from "./utils/regexps";

type DebugLevel = 'log' | 'info' | 'warn' | 'error';
let debugLevel = 'log';
const DEBUG_LEVELS = ['log', 'info', 'warn', 'error'];

let warnsCount = 0;
let errorsCount = 0;

const KNOWN_INVALID_FILE_ENDINGS_IGNORE = [
    'itf_formbuilder/components/utils/translatableError.ts',
    'itf_formbuilder_react/utils/translatableError.ts',
];

function endsWith(fullStr: string, partStr: string, ignoreCase: boolean = true): boolean {
    if (ignoreCase) {
        fullStr = fullStr.toLowerCase();
        partStr = partStr.toLowerCase();
    }

    return fullStr.substring(fullStr.length - partStr.length) === partStr;
}

function normalizePath(path: string, dirSeparator: string = '/'): string {
    return path.replace(/[\\/]/g, dirSeparator);
}

function log(level: DebugLevel, info: string, ...params) {
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

function exitWithReason(
    reason: string,
    reasonLevel: DebugLevel = 'error',
) {
    log(reasonLevel, reason);
    process.exit();
}

interface Config {
    paths: string[];
    output: string;
    langs: string[];
    excludeLibraryItself?: boolean;
    includeApiErrorCodesFromTypes?: boolean;
    debugLevel?: DebugLevel;
}

function checkConfigFile(config: Config): boolean {
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

async function sortTranslations(
    lang: string,
    output: string,
) {
    let currentTranslations: {
        [lang: string]: {
            [key: string]: any,
        },
    } = {};

    try {
        currentTranslations = await loadJsonFile(output);
    } catch (e) {
    }

    log("log", 'Rearranging object as needed...');

    const allKeysSorted = Object.keys(currentTranslations[lang])
        .sort();

    const newObj: {
        [lang: string]: {
            [key: string]: any,
        },
    } = {};

    for (const key of allKeysSorted) {
        newObj[key] = currentTranslations[lang][key];
    }

    currentTranslations[lang] = newObj;;

    await saveJsonFile(output, currentTranslations);
}

async function processAllTranslations(
    lang: string,
    foundsOk: string[],
    output: string,
) {
    let currentTranslations: {
        [lang: string]: {
            [key: string]: string,
        },
    } = {};

    const currentHas = (key: string) => currentTranslations[lang].hasOwnProperty(key);
    const foundHas = (key: string) => foundsOk.indexOf(key) > -1;

    const addOne = (key: string) => {
        currentTranslations[lang] = currentTranslations[lang] || {};
        if (!currentHas(key)) {
            log("warn", 'Adding translation', key, 'lang', lang);
            currentTranslations[lang][key] = key;
        }
    };

    try {
        currentTranslations = await loadJsonFile(output);
    } catch (e) {
    }

    foundsOk.forEach(addOne);

    await saveJsonFile(output, currentTranslations);

    for (const key in currentTranslations[lang]) {
        if (key !== '_API_ERROR_CODES_' && !foundHas(key)) {
            log("warn", 'Looks like translation is no longer to be found (outdated?)', key);
        }
    }

    log("info", 'Total number of translations', 'In file', Object.keys(currentTranslations[lang]).length, 'Found in code', foundsOk.length, 'for lang', lang);
}

async function processErrorTypesTranslations(
    lang: string,
    foundsOk: {
        value: number;
        typeAlias: string;
    }[],
    output: string,
) {
    let currentTranslations: {
        [lang: string]: {
            _API_ERROR_CODES_: {
                [value: number]: {
                    text: string;
                    __type_alias_do_not_touch: string;
                },
            },
            [key: string]: string|any/* For the one above*/;
        },
    } = {};

    const currentHas = (value: number, typeAlias: string) => currentTranslations[lang]._API_ERROR_CODES_ && Object.entries(currentTranslations[lang]._API_ERROR_CODES_).some(one => {
        const [valueInOne, dataInOne] = one;
        return Number(valueInOne) === value && dataInOne.__type_alias_do_not_touch === typeAlias;
    });
    const foundHas = (value: number, typeAlias: string) => foundsOk.some(one => one.value === value && one.typeAlias === typeAlias);

    const addOne = (value: number, typeAlias: string) => {
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
        currentTranslations = await loadJsonFile(output);
    } catch (e) {
    }

    foundsOk.forEach(one => addOne(one.value, one.typeAlias));

    await saveJsonFile(output, currentTranslations);

    for (const value in currentTranslations[lang]._API_ERROR_CODES_) {
        if (!foundHas(Number(value), currentTranslations[lang]._API_ERROR_CODES_[value].__type_alias_do_not_touch)) {
            log("warn", 'Looks like translation is no longer to be found (outdated?)', currentTranslations[lang]._API_ERROR_CODES_[value].__type_alias_do_not_touch, `(${value})`);
        }
    }

    log("info", 'Total number of type translations', 'In file', Object.keys(currentTranslations[lang]._API_ERROR_CODES_).length, 'Found in code', foundsOk.length, 'for lang', lang);
}

async function upgradeAndAutoMigrate(
    output: string,
    config: Config,
) {
    {
        // -------- Auto migrate flat translation file to multi-languages -------
        let currentTranslations: any;

        try {
            currentTranslations = await loadJsonFile(output);
        } catch (e) {
        }

        if (Object.values(currentTranslations).every((something: any) => typeof something === 'string')) {
            log("warn", 'Auto migrating flat translation file to multi-languages');
            currentTranslations = {
                [config.langs[0]]: currentTranslations,
            };
            await saveJsonFile(output, currentTranslations);
        }
    }
}

type NumericEnum = Record<number, string> & { [k: number]: string };

function enumToValueAndAlias(theEnum: NumericEnum, enumName: string = 'ApiErrorCode'): {
    value: number;
    typeAlias: string;
}[] {
    return Object.entries(theEnum)
        .filter(one => !Number.isNaN(Number(one[0])))
        .map(one => {
            const [value, typeAlias] = one;
            return {value: Number(value), typeAlias: `${enumName}.${typeAlias}`};
        });
}

async function loadApiErrorCodes(currentDir: string): Promise<NumericEnum> {
    const packageJsonFn = path.join(currentDir, 'package.json');
    let packageJson;

    try {
        packageJson = await loadUtf8File(packageJsonFn);
    } catch(e) {
        log('error', 'Cannot load package.json to find the types!', packageJsonFn);
        exitWithReason('Cannot load package.json to find the types!');
    }

    const typesDependencyName = findTypesDependencyName(packageJson);

    if (typesDependencyName === null || !typesDependencyName) {
        exitWithReason('Cannot find types dependency repository name! Make sure it is in package.json under dependencies, like `"my-project-types": "git+......-types",` or disable includeApiErrorCodesFromTypes in config.');
    }

    const apiErrorCodesFile = path.join(
        currentDir,
        'node_modules',
        typesDependencyName,
        'dist/apiMessages/errorCodes.js'
    );

    try {
        fs.accessSync(apiErrorCodesFile)
    } catch(e) {
        log('error', 'Cannot find ApiErrorCode file! Searching at', apiErrorCodesFile);
        exitWithReason('Cannot find ApiErrorCode file!');
    }

    const theEnum = require(apiErrorCodesFile).ApiErrorCode;

    return theEnum;
}

(async () => {
    const currentDir = process.cwd();
    log("info", 'Current dir', currentDir);
    let config: Config;
    try {
        config = await loadJsonFile(path.join(currentDir, 'itfformbuilder.json'));
        log("info", 'Current config', config);
    } catch (e) {
        return exitWithReason('Cannot find itfformbuilder.json configuration file or it is invalid JSON.');
    }

    if (!checkConfigFile(config)) {
        return;
    }

    let {paths, output} = config;
    const {excludeLibraryItself, langs, includeApiErrorCodesFromTypes} = config;

    output = path.join(currentDir, output);

    await prepareFileIfDoesNotExist(output);

    await upgradeAndAutoMigrate(output, config);

    if (excludeLibraryItself !== true) {
        paths.push('node_modules/itf_formbuilder');
        paths.push('node_modules/itf_formbuilder_react');
    }

    paths = paths
        .map(dir => path.join(currentDir, dir))
        .filter(dir => fs.existsSync(dir));

    log("info", 'Please wait scanning directories...', paths);

    let files: string[] = [];

    for (const dir of paths) {
        files = [
            ...files,
            ...(await readdir(dir))
                .filter(isTsFile),
        ];
    }

    log("info", 'Found .tsx? files', files.length);

    let foundsOk: string[] = [];
    let foundsError: string[] = [];

    for (const file of files) {
        if (KNOWN_INVALID_FILE_ENDINGS_IGNORE.some(oneIgnore => (
            endsWith(
                normalizePath(file),
                normalizePath(oneIgnore),
            )
        ))) {
            log("info", 'Ignoring known invalid file used by system', file);
            continue;
        }

        const str = await loadUtf8File(
            file,
        );

        foundsOk = [...foundsOk, ...getTranslatableErrorStrings(str)];
        foundsError = [...foundsError, ...getInvalidTranslatableErrorUsageLines(str, file)];
    }

    for (const errorLine of foundsError) {
        log("error", 'Invalid usage of translatable errors found! First parameter should always be constant string!', errorLine);
    }

    foundsOk = [...(new Set(foundsOk))]; // Unique

    for (const lang of langs) {
        await processAllTranslations(lang, foundsOk, output);
    }

    const loadedApiErrorCodes = enumToValueAndAlias(await loadApiErrorCodes(currentDir));

    if (includeApiErrorCodesFromTypes) {
        for (const lang of langs) {
            await processErrorTypesTranslations(lang, loadedApiErrorCodes, output);
        }
    }

    for (const lang of langs) {
        await sortTranslations(lang, output);
    }

    const lastInfoLevel = errorsCount > 0 ? "error" : (
        warnsCount > 0 ? "warn" : "info"
    );

    log(lastInfoLevel, '-------------- Process finished --------------', errorsCount, 'errors', warnsCount, 'warnings.');

})();