import {
  END_RENT_PHOTO_MAX_AGE_MS,
  assertEndRentPhotoFresh,
  isEndRentPhotoFresh,
} from './end-rent-photo-age';

describe('end rent photo age', () => {
  const now = new Date('2026-10-08T12:00:00.000Z');

  it('accepts a photo taken exactly at the age limit', () => {
    const takenAt = new Date(now.getTime() - END_RENT_PHOTO_MAX_AGE_MS);
    expect(isEndRentPhotoFresh(takenAt, now)).toBe(true);
  });

  it('rejects a photo one millisecond past the limit', () => {
    const takenAt = new Date(now.getTime() - END_RENT_PHOTO_MAX_AGE_MS - 1);
    expect(isEndRentPhotoFresh(takenAt, now)).toBe(false);
  });

  it('throws a named error for a stale photo', () => {
    jest.useFakeTimers();
    jest.setSystemTime(now);

    expect(() =>
      assertEndRentPhotoFresh(
        new Date(now.getTime() - END_RENT_PHOTO_MAX_AGE_MS - 1),
      ),
    ).toThrow(
      expect.objectContaining({
        name: 'EndRentPhotoTooOldError',
        message: 'end_rent_photo_too_old',
      }),
    );

    jest.useRealTimers();
  });
});
