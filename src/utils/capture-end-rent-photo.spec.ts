import { CameraErrorCode } from '@capacitor/camera';
import { isCameraPermissionDenied } from './capture-end-rent-photo';

describe('isCameraPermissionDenied', () => {
  it('matches the camera permission error and ignores other values', () => {
    expect(
      isCameraPermissionDenied({ code: CameraErrorCode.CameraPermissionDenied }),
    ).toBe(true);
    expect(
      isCameraPermissionDenied({ code: CameraErrorCode.TakePhotoCancelled }),
    ).toBe(false);
    expect(isCameraPermissionDenied(new Error('no'))).toBe(false);
    expect(isCameraPermissionDenied(null)).toBe(false);
  });
});
