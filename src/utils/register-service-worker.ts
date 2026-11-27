import { Capacitor } from '@capacitor/core';

const SERVICE_WORKER_URL = '/sw.js';
const SERVICE_WORKER_SCOPE = '/';

export const registerServiceWorker = () => {
  if (
    !import.meta.env.PROD ||
    Capacitor.isNativePlatform() ||
    !('serviceWorker' in navigator)
  ) {
    return;
  }

  const register = () => {
    void navigator.serviceWorker
      .register(SERVICE_WORKER_URL, { scope: SERVICE_WORKER_SCOPE })
      .catch(() => {
        // Bots and locked-down browsers reject registration. Install is optional.
      });
  };

  if (document.readyState === 'complete') {
    register();
    return;
  }

  window.addEventListener('load', register, { once: true });
};
