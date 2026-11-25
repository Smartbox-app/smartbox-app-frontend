"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function cacheGetAndCleanupOnlyThisFormIfNeeded(formId, schemaCacheMaxTimeSeconds) {
    window['itfApiFormSchemaCache'] = window['itfApiFormSchemaCache'] || [];
    var cache = window['itfApiFormSchemaCache'];
    var foundIndex = cache.findIndex(function (one) { return one.formId === formId; });
    if (foundIndex > -1) {
        var dtMinus = new Date();
        dtMinus.setSeconds(dtMinus.getSeconds() - schemaCacheMaxTimeSeconds);
        if (cache[foundIndex].createdAt < dtMinus) {
            cache.splice(foundIndex, 1);
            return null;
        }
        else {
            cache[foundIndex].uses++;
            return cache[foundIndex].schema;
        }
    }
    else {
        return null;
    }
}
exports.cacheGetAndCleanupOnlyThisFormIfNeeded = cacheGetAndCleanupOnlyThisFormIfNeeded;
function cacheSetAndCleanupAllIfNeeded(formId, schema, schemaCacheMaxTimeSeconds, schemaCacheMaxElements) {
    window['itfApiFormSchemaCache'] = window['itfApiFormSchemaCache'] || [];
    var cache = window['itfApiFormSchemaCache'];
    var foundIndex = cache.findIndex(function (one) { return one.formId === formId; });
    if (foundIndex > -1) {
        // Remove previous version if needed
        cache.splice(foundIndex, 1);
    }
    cache.push({
        formId: formId,
        schema: schema,
        createdAt: new Date(),
        uses: 1,
    });
    // Cleanup:
    var dtMinus = new Date();
    dtMinus.setSeconds(dtMinus.getSeconds() - schemaCacheMaxTimeSeconds);
    window['itfApiFormSchemaCache'] = cache
        .filter(function (one) { return (one.createdAt > dtMinus); });
    cache = window['itfApiFormSchemaCache'];
    if (cache.length > schemaCacheMaxElements) {
        cache
            .sort(function (a, b) { return b.uses - a.uses; })
            .splice(schemaCacheMaxElements, cache.length);
    }
}
exports.cacheSetAndCleanupAllIfNeeded = cacheSetAndCleanupAllIfNeeded;
