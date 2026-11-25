import { FormFieldToRender } from "../ItfFormBuilder";
export declare function cacheGetAndCleanupOnlyThisFormIfNeeded(formId: string, schemaCacheMaxTimeSeconds: number): FormFieldToRender[] | null;
export declare function cacheSetAndCleanupAllIfNeeded(formId: string, schema: FormFieldToRender[], schemaCacheMaxTimeSeconds: number, schemaCacheMaxElements: number): void;
