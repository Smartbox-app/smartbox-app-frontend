export interface TheTreeData<T> {
    branches: {
        [key: string]: TheTreeData<T>;
    };
    value: T | null;
}
export declare class TheTree<T> {
    data: TheTreeData<T>;
    checkExistence(path: string): boolean;
    init(path: string, valueIfNonExistent: any): void;
    get(path: string): T;
    getWithDefault(path: string, defaultValue: T): T;
    setOnlyIfNonExistent: (path: string, valueIfNonExistent: any) => void;
    set(path: string, value: T): void;
    deepMapValues<Y>(fn: (value: T, path: string) => Y, includeNull?: boolean): any;
    flattenValues(includeNull?: boolean): {
        [path: string]: T | null;
    };
    static forEachValue<T>(obj: TheTreeData<T>, fn: (value: T | null, path: string) => any | void, path?: string, includeNull?: boolean): void;
    static validatePath(path: string): void;
    static rootPath: string;
    static levelDown(oldPath: string, ...newLevels: string[]): string;
    static levelUp(oldPath: string): string;
}
