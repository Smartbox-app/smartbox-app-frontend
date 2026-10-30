export default function format(s: string, ...params: any[]) {
    return s.replace(/{(\d+)}/g, function(match, number) {
        return typeof params[number] != 'undefined'
            ? params[number]
            : match
            ;
    });
};