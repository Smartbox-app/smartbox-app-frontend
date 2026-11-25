import {FormFieldToRender} from "../ItfFormBuilder";

interface SchemaCacheEntry {
    formId: string;
    createdAt: Date;
    schema: FormFieldToRender[];
    uses: number;
}

export function cacheGetAndCleanupOnlyThisFormIfNeeded(
    formId: string,
    schemaCacheMaxTimeSeconds: number,
): FormFieldToRender[]|null {
    window['itfApiFormSchemaCache'] = window['itfApiFormSchemaCache'] || [];

    const cache: SchemaCacheEntry[] = window['itfApiFormSchemaCache'];

    const foundIndex = cache.findIndex(one => one.formId === formId);
    if (foundIndex > -1) {
        const dtMinus = new Date();
        dtMinus.setSeconds(dtMinus.getSeconds() - schemaCacheMaxTimeSeconds);
        if (cache[foundIndex].createdAt < dtMinus) {
            cache.splice(foundIndex, 1);
            return null;
        } else {
            cache[foundIndex].uses++;
            return cache[foundIndex].schema;
        }
    } else {
        return null;
    }
}

export function cacheSetAndCleanupAllIfNeeded(
    formId: string,
    schema: FormFieldToRender[],
    schemaCacheMaxTimeSeconds: number,
    schemaCacheMaxElements: number,
) {
    window['itfApiFormSchemaCache'] = window['itfApiFormSchemaCache'] || [];

    let cache: SchemaCacheEntry[] = window['itfApiFormSchemaCache'];

    const foundIndex = cache.findIndex(one => one.formId === formId);
    if (foundIndex > -1) {
        // Remove previous version if needed
        cache.splice(foundIndex, 1);
    }

    cache.push({
        formId,
        schema,
        createdAt: new Date(),
        uses: 1,
    });

    // Cleanup:
    const dtMinus = new Date();
    dtMinus.setSeconds(dtMinus.getSeconds() - schemaCacheMaxTimeSeconds);

    window['itfApiFormSchemaCache'] = cache
        .filter(one => (
            one.createdAt > dtMinus
        ));

    cache = window['itfApiFormSchemaCache'];

    if (cache.length > schemaCacheMaxElements) {
        cache
            .sort((a, b) => b.uses - a.uses)
            .splice(schemaCacheMaxElements, cache.length);
    }
}