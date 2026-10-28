export function pseudoArrayToArray(pseudoAr: any): any[] {
    const ar: any[] = [];
    for (const el of pseudoAr) {
        ar.push(el);
    }
    return ar;
}