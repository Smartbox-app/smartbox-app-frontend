export function formatPrice(n: number, isHtml = false): string {
    return Number(n).toFixed(2)
        .replace(
            /(\d)(?=(\d{3})+(?!\d))/g,
            '$1' + (isHtml ? '&nbsp;' : ' '))
        .replace('.', ',')+' zł';
}