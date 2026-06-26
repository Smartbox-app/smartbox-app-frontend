import { Capacitor } from '@capacitor/core';
import { getClientMobileOs } from './detect-client-mobile-os';

export const canCaptureEndRentPhoto = () =>
  Capacitor.isNativePlatform() || getClientMobileOs() !== null;

export const getEndRentSource = () =>
  canCaptureEndRentPhoto() ? 'mobile' : 'web';
