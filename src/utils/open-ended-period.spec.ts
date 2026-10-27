import {
  openEndedFirstPeriodFinish,
  openEndedNextInvoiceDate,
} from 'src/utils/open-ended-period';

const expectLocalDate = (
  date: Date,
  year: number,
  month: number,
  day: number,
  hours: number,
) => {
  expect(date.getFullYear()).toBe(year);
  expect(date.getMonth()).toBe(month);
  expect(date.getDate()).toBe(day);
  expect(date.getHours()).toBe(hours);
};

describe('open-ended period dates', () => {
  const start = new Date(2026, 9, 1, 15, 30);

  it('ends a 30-day period on the 30th, inclusive of the start day', () => {
    expectLocalDate(openEndedFirstPeriodFinish(start, 30), 2026, 9, 30, 23);
    expect(openEndedFirstPeriodFinish(start, 30).getMinutes()).toBe(59);
  });

  it('ends a one-day period on the start day', () => {
    expectLocalDate(openEndedFirstPeriodFinish(start, 1), 2026, 9, 1, 23);
  });

  it('places the next invoice a lead time before the day after the period ends', () => {
    const finish = openEndedFirstPeriodFinish(start, 30);

    expectLocalDate(openEndedNextInvoiceDate(finish, 7), 2026, 9, 24, 0);
    expectLocalDate(openEndedNextInvoiceDate(finish, 3), 2026, 9, 28, 0);
  });
});
