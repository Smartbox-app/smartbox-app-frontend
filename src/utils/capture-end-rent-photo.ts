import {
  Camera,
  CameraDirection,
  CameraErrorCode,
  EncodingType,
  type MediaResult,
} from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export type EndRentPhotoCapture = {
  file: File;
  takenAt: Date;
};

const parseCreationDate = (value?: string): Date | null => {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

const base64ToFile = (base64: string, format: string): File => {
  const normalizedFormat = format.replace('jpg', 'jpeg');
  const mime =
    normalizedFormat === 'png' ? 'image/png' : 'image/jpeg';
  const extension = normalizedFormat === 'png' ? 'png' : 'jpg';
  const byteString = atob(base64);
  const bytes = new Uint8Array(byteString.length);

  for (let index = 0; index < byteString.length; index += 1) {
    bytes[index] = byteString.charCodeAt(index);
  }

  return new File([bytes], `end-rent-photo.${extension}`, { type: mime });
};

const mediaResultToFile = async (result: MediaResult): Promise<File | null> => {
  const format = result.metadata?.format ?? 'jpeg';
  const path =
    result.webPath ??
    (result.uri ? Capacitor.convertFileSrc(result.uri) : null);

  if (path) {
    const response = await fetch(path);
    const blob = await response.blob();
    const extension = format === 'png' ? 'png' : 'jpg';
    const mime = blob.type || (extension === 'png' ? 'image/png' : 'image/jpeg');

    return new File([blob], `end-rent-photo.${extension}`, { type: mime });
  }

  if (result.thumbnail) {
    return base64ToFile(result.thumbnail, format);
  }

  return null;
};

const isCancelledCapture = (error: unknown): boolean => {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return false;
  }

  const code = (error as { code?: string }).code;

  return (
    code === CameraErrorCode.TakePhotoCancelled ||
    code === CameraErrorCode.EditPhotoCancelled
  );
};

export const isCameraPermissionDenied = (error: unknown): boolean => {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return false;
  }

  const code = (error as { code?: string }).code;

  return code === CameraErrorCode.CameraPermissionDenied;
};

export const captureEndRentPhotoWithCamera = async (): Promise<EndRentPhotoCapture | null> => {
  const permissions = await Camera.requestPermissions({
    permissions: ['camera'],
  });

  if (permissions.camera !== 'granted' && permissions.camera !== 'limited') {
    throw new Error('camera_permission_denied');
  }

  try {
    const result = await Camera.takePhoto({
      quality: 85,
      encodingType: EncodingType.JPEG,
      cameraDirection: CameraDirection.Rear,
      saveToGallery: false,
      correctOrientation: true,
      includeMetadata: true,
      targetWidth: 1024,
    });

    const file = await mediaResultToFile(result);
    if (!file) return null;

    const takenAt =
      parseCreationDate(result.metadata?.creationDate) ?? new Date();

    return { file, takenAt };
  } catch (error) {
    if (isCancelledCapture(error)) {
      return null;
    }

    throw error;
  }
};
