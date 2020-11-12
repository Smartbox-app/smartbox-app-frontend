import { format } from 'date-fns';

export function dateOnly(n: Date | string, slice?: number): any {
  if (n === null) return '---';
  if (slice) {
    return format(new Date(n), 'dd.MM.yyyy').slice(0, slice);
  }
  return format(new Date(n), 'dd.MM.yyyy');
}
