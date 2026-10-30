"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TheTree {
    constructor() {
        this.data = {
            branches: {},
            value: null,
        };
        this.setOnlyIfNonExistent = this.init;
    }
    checkExistence(path) {
        TheTree.validatePath(path);
        try {
            this.get(path);
            return true;
        }
        catch (e) {
            return false;
        }
    }
    init(path, valueIfNonExistent) {
        TheTree.validatePath(path);
        if (!this.checkExistence(path)) {
            this.set(path, valueIfNonExistent);
        }
    }
    get(path) {
        TheTree.validatePath(path);
        const parts = path.split('.').splice(1);
        let currLvl = this.data;
        for (const part of parts) {
            if (currLvl.branches.hasOwnProperty(part)) {
                currLvl = currLvl.branches[part];
            }
            else {
                throw new Error(`TheTreeError: path does not exist. Looking for "${path}" and cannot find "${part}" in branch with keys: ${Object.keys(currLvl.branches).join(', ')}.`);
            }
        }
        return currLvl.value;
    }
    getWithDefault(path, defaultValue) {
        TheTree.validatePath(path);
        try {
            return this.get(path);
        }
        catch (e) {
            return defaultValue;
        }
    }
    set(path, value) {
        TheTree.validatePath(path);
        const parts = path.split('.').splice(1);
        let currLvl = this.data;
        for (const part of parts) {
            if (!currLvl.branches.hasOwnProperty(part)) {
                currLvl.branches[part] = {
                    branches: {},
                    value: null,
                };
            }
            currLvl = currLvl.branches[part];
        }
        currLvl.value = value;
    }
    deepMapValues(fn, includeNull = false) {
        const deepCopy = JSON.parse(JSON.stringify(this.data));
        const map = (obj, path) => {
            if (obj.value !== null || includeNull) {
                obj.value = fn(obj.value, path);
            }
            const keys = Object.keys(obj.branches);
            for (const key of keys) {
                map(obj.branches[key], TheTree.levelDown(path, key));
            }
        };
        map(deepCopy, '');
        return deepCopy;
    }
    flattenValues(includeNull = false) {
        const deepCopy = JSON.parse(JSON.stringify(this.data));
        const result = {};
        TheTree.forEachValue(deepCopy, (value, path) => {
            result[path] = value;
        }, '', includeNull);
        return result;
    }
    static forEachValue(obj, fn, path = '', includeNull = false) {
        if (obj.value !== null || includeNull) {
            fn(obj.value, path);
        }
        const keys = Object.keys(obj.branches);
        for (const key of keys) {
            TheTree.forEachValue(obj.branches[key], fn, TheTree.levelDown(path, key));
        }
    }
    static validatePath(path) {
        let parts = path.split('.');
        if (parts[0] !== '') {
            throw new Error('TheTreeError: invalid path, reason: first part of path should be empty string, meaning all pathes should start with ".".');
        }
        parts = parts.splice(1);
        for (const part of parts) {
            if (part === '') {
                throw new Error('TheTreeError: invalid path, reason: some part is empty string, meaning there are two "." next to each other of there is leading "." at the end of path.');
            }
        }
    }
    static levelDown(oldPath, ...newLevels) {
        return `${oldPath}.${newLevels.join('.')}`;
    }
    static levelUp(oldPath) {
        if (oldPath === '') {
            throw new Error('TheTreeError: already highest possible level.');
        }
        const parts = oldPath.split('.');
        parts.splice(-1);
        return parts.join('.');
    }
}
TheTree.rootPath = '';
exports.TheTree = TheTree;
