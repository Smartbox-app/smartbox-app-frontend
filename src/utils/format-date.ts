// import { format } from 'date-fns';
import { isDate } from 'date-fns';
import { format, formatInTimeZone, toZonedTime } from 'date-fns-tz';

export function dateOnly(n: Date | string, slice?: number): any {
  if (n === null) return '---';

  if (slice) {
    return formatInTimeZone(n, 'Europe/Warsaw', 'dd.MM.yyyy').slice(0, slice);
  }
  return formatInTimeZone(n, 'Europe/Warsaw', 'dd.MM.yyyy');
}

export function dateOnlyNormalized(n: Date | string, slice?: number): any {
  if (n === null) return '---';

  if (slice) {
    return formatInTimeZone(n, 'Europe/Warsaw', 'yyyy-MM-dd').slice(0, slice);
  }
  return formatInTimeZone(n, 'Europe/Warsaw', 'yyyy-MM-dd');
}

export const fullDate = (d: Date | string): string => {
  if (d === null) return '---';

  try {
    return formatInTimeZone(d, 'Europe/Warsaw', 'dd.MM.yyyy HH:mm');
  } catch {
    return '---';
  }
};

export function dateOnlyLocalTime(n: Date | string) {
  if (n === null) return '---';
  return format(n, 'dd.MM.yyyy');
}

export const formatForPLTimeZone = (val: any) => {
  const dateVal: Date = val as Date;
  const timeZone = 'Europe/Warsaw';
  const zonedDate = toZonedTime(dateVal, timeZone);
  return zonedDate;
};
