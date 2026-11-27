export const reloadForNewVersion = () => {
  window.location.reload();
};

const STALE_CHUNK_RELOAD_KEY = 'stale-chunk-reload';

// ponytail: one reload per tab. A second missing chunk in the same tab waits for a manual refresh.
export const installStaleChunkReload = (
  reload: () => void = () => window.location.reload(),
) => {
  const onPreloadError = (event: Event) => {
    try {
      if (sessionStorage.getItem(STALE_CHUNK_RELOAD_KEY)) return;
      sessionStorage.setItem(STALE_CHUNK_RELOAD_KEY, '1');
    } catch {
      return;
    }

    event.preventDefault();
    reload();
  };

  window.addEventListener('vite:preloadError', onPreloadError);
  return () => window.removeEventListener('vite:preloadError', onPreloadError);
};
