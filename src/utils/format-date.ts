export function dateOnly(n: Date | string, slice?: number): any {
  if (n === null) return '---';
  if (slice) {
    return new Date(n).toLocaleDateString().slice(0, slice);
  }
  return new Date(n).toLocaleDateString();
}
