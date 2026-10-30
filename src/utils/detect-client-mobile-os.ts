export type ClientMobileOs = 'android' | 'ios';

export const getClientMobileOs = (): ClientMobileOs | null => {
  if (typeof navigator === 'undefined') {
    return null;
  }

  const userAgent = navigator.userAgent.toLowerCase();

  if (/android/.test(userAgent)) {
    return 'android';
  }

  if (/iphone|ipad|ipod/.test(userAgent)) {
    return 'ios';
  }

  return null;
};
