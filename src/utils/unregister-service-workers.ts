import { Capacitor } from '@capacitor/core';

export const unregisterServiceWorkersIfNative = () => {
  if (!Capacitor.isNativePlatform() || !('serviceWorker' in navigator)) {
    return;
  }

  void navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((registration) => {
      void registration.unregister();
    });
  });
};
