export function dateOnly(n: Date | string, slice?: number): any {
  if (slice) {
    return new Date(n).toLocaleDateString().slice(0, slice);
  }
  return new Date(n).toLocaleDateString();
}
