export const END_RENT_PHOTO_MAX_AGE_MS = 15 * 60 * 1000;

export const isEndRentPhotoFresh = (
  takenAt: Date,
  now: Date = new Date(),
): boolean => now.getTime() - takenAt.getTime() <= END_RENT_PHOTO_MAX_AGE_MS;

export const getFilePhotoTakenAt = (file: File): Date =>
  new Date(file.lastModified);

export class EndRentPhotoTooOldError extends Error {
  constructor() {
    super('end_rent_photo_too_old');
    this.name = 'EndRentPhotoTooOldError';
  }
}

export const assertEndRentPhotoFresh = (takenAt: Date): void => {
  if (!isEndRentPhotoFresh(takenAt)) {
    throw new EndRentPhotoTooOldError();
  }
};
