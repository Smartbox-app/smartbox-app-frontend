const PRELOAD_RELOAD_KEY = 'vite-preload-reloaded';

export const reloadWithoutServiceWorker = () => {
  const reload = () => window.location.reload();

  if (!('serviceWorker' in navigator)) {
    reload();
    return;
  }

  navigator.serviceWorker
    .getRegistrations()
    .then((registrations) =>
      Promise.all(
        registrations.map((registration) => registration.unregister()),
      ),
    )
    .then(reload)
    .catch(reload);
};

export const beginPreloadReload = (): boolean => {
  try {
    if (sessionStorage.getItem(PRELOAD_RELOAD_KEY)) {
      return false;
    }
    sessionStorage.setItem(PRELOAD_RELOAD_KEY, '1');
    return true;
  } catch {
    return false;
  }
};

export const clearPreloadReloadFlag = () => {
  try {
    sessionStorage.removeItem(PRELOAD_RELOAD_KEY);
  } catch {
    // sessionStorage can throw when storage is blocked
  }
};
