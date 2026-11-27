import { installStaleChunkReload } from 'src/utils/reload-without-service-worker';

describe('installStaleChunkReload', () => {
  const store = new Map<string, string>();

  beforeEach(() => {
    store.clear();
    Object.defineProperty(globalThis, 'sessionStorage', {
      configurable: true,
      value: {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => {
          store.set(key, String(value));
        },
      },
    });
  });

  it('reloads once when a chunk fails to load', () => {
    const reload = jest.fn();
    const uninstall = installStaleChunkReload(reload);

    const first = new Event('vite:preloadError', { cancelable: true });
    window.dispatchEvent(first);
    expect(first.defaultPrevented).toBe(true);
    expect(reload).toHaveBeenCalledTimes(1);

    const second = new Event('vite:preloadError', { cancelable: true });
    window.dispatchEvent(second);
    expect(second.defaultPrevented).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);

    uninstall();
  });
});
