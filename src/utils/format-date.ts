// import { format } from 'date-fns';
import { format, formatInTimeZone, toZonedTime } from 'date-fns-tz';

export function dateOnly(n: Date | string, slice?: number): any {
  if (n === null) return '---';

  if (slice) {
    return formatInTimeZone(n, 'Europe/Warsaw', 'dd.MM.yyyy').slice(0, slice);
  }
  return formatInTimeZone(n, 'Europe/Warsaw', 'dd.MM.yyyy');
}

export const fullDate = (d: Date | string): string => {
  if (d === null) return '---';

  return formatInTimeZone(d, 'Europe/Warsaw', 'dd.MM.yyyy HH:mm');
};

export function dateOnlyLocalTime(n: Date | string) {
  if (n === null) return '---';
  return format(n, 'dd.MM.yyyy');
}
