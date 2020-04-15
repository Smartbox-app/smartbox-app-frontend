export function dateOnly(n: Date | string): any {
  return new Date(n).toLocaleDateString();
}
