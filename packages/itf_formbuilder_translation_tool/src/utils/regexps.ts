const isTsFileRegEx = /\.tsx?$/i;
const isDTsFileRegEx = /\.d\.ts?$/i;

export function isTsFile(fn: string): boolean {
    return (
        (!!fn.match(isTsFileRegEx))
        &&
        (!fn.match(isDTsFileRegEx))
    );
}

const isNodeModulesDirRegEx = /[\\/]node_modules[\\/]?$/i;

export function isNodeModulesDir(fn: string): boolean {
    return (!!fn.match(isNodeModulesDirRegEx));
}

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

export function getTranslatableErrorStrings(str: string): string[] {
    let founds = [];

    for (const regex of validTranslatableErrorsRegExps) {
        let m;

        while ((m = regex.exec(str)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            founds = [...founds, m[1]];
        }
    }

    return founds;
}

export function getInvalidTranslatableErrorUsageLines(str: string, fn: string): string[] {
    let founds = [];

    for (const regex of invalidTranslatableErrorsRegExps) {
        let m;

        while ((m = regex.exec(str)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
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

const typesDependencyRegExp = /"([a-zA-Z0-9-_\.]+-types)": "git\+[^"]+-types/;

export function findTypesDependencyName(packageJson: string): string|null {
    const match = packageJson.match(typesDependencyRegExp);
    return match ? match[1] : null;
}