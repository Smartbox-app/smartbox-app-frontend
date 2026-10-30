import { Capacitor } from '@capacitor/core';

import { getClientMobileOs } from 'src/utils/detect-client-mobile-os';

export const canCaptureEndRentPhoto = () =>
  Capacitor.isNativePlatform() || getClientMobileOs() !== null;

export const getEndRentSource = () =>
  canCaptureEndRentPhoto() ? 'mobile' : 'web';
