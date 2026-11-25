import * as util from "util";
import * as fs from "fs";
import * as path from "path";
import {isNodeModulesDir} from "./regexps";

export async function loadUtf8File(fn: string): Promise<string> {
    return util.promisify(fs.readFile)(fn, {
        encoding: 'utf8',
    });
}

export async function loadJsonFile(fn: string): Promise<any> {
    return JSON.parse(await loadUtf8File(fn));
}

export async function saveUtf8File(fn: string, data: string) {
    util.promisify(fs.writeFile)(fn, data, {
        encoding: 'utf8',
    });
}

export async function prepareFileIfDoesNotExist(fn: string, defaultEmptyData: string = '{}') {
    try {
        fs.accessSync(fn, fs.constants.F_OK);
    } catch(e) {
        console.log('Translation file does not exist? Creating it.', fn);
        await saveUtf8File(fn, defaultEmptyData);
    }
}

export async function saveJsonFile(fn: string, data: any) {
    await saveUtf8File(fn, JSON.stringify(data, null, 2));
}

export async function readdir(dir: string): Promise<string[]> {
    let files = (await util.promisify(fs.readdir)(dir))
        .map(fn => path.join(dir, fn))
        .filter(fn => !isNodeModulesDir(fn));

    for (const fn of files) {
        if ((await util.promisify(fs.stat)(fn)).isDirectory()) {
            files = [
                ...files,
                ...await readdir(
                    fn,
                ),
            ];
        }
    }

    return files;
}