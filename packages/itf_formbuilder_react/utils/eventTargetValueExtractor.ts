export function eventTargetValueExtractor(
    onChange: Function,
    valueFieldName: string = 'value',
    customVal?: (val: string) => any,
) {
    return e => onChange(typeof customVal === 'function' ? customVal(e.target[valueFieldName]) : e.target[valueFieldName]);
}