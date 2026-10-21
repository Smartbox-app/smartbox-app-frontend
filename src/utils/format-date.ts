// import { format } from 'date-fns';

import { format, formatInTimeZone, toZonedTime } from 'date-fns-tz';

export function dateOnly(n: Date | string | null, slice?: number): string {
  if (n === null) return '---';

  if (slice) {
    return formatInTimeZone(n, 'Europe/Warsaw', 'dd.MM.yyyy').slice(0, slice);
  }
  return formatInTimeZone(n, 'Europe/Warsaw', 'dd.MM.yyyy');
}

export function dateOnlyNormalized(n: Date | string | null, slice?: number): string {
  if (n === null) return '---';

  if (slice) {
    return formatInTimeZone(n, 'Europe/Warsaw', 'yyyy-MM-dd').slice(0, slice);
  }
  return formatInTimeZone(n, 'Europe/Warsaw', 'yyyy-MM-dd');
}

export const toDate = (value: Date | string | number): Date | null => {
  const date =
    typeof value === 'string' && /^\d+$/.test(value)
      ? new Date(Number(value))
      : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const fullDate = (d: Date | string | number): string => {
  if (d === null) return '---';
  const date = toDate(d);
  if (!date) return '---';

  try {
    return formatInTimeZone(date, 'Europe/Warsaw', 'dd.MM.yyyy HH:mm');
  } catch {
    return '---';
  }
};

export function dateOnlyLocalTime(n: Date | string) {
  if (n === null) return '---';
  return format(n, 'dd.MM.yyyy');
}

export const formatForPLTimeZone = (val: Date | string | number): Date => {
  return toZonedTime(val, 'Europe/Warsaw');
};
