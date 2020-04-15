export function formatThousands(n: number, isHtml = false, toFixed = 2): string {
  return Number(n)
    .toFixed(toFixed)
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, `$1${isHtml ? '&nbsp;' : ' '}`)
    .replace('.', ',');
}

export function formatPrice(n: number, isHtml = false): string {
  return `${formatThousands(n, isHtml)}zł`;
}
