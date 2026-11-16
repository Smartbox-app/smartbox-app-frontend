import { App } from '@capacitor/app';
import { Capacitor, PluginListenerHandle } from '@capacitor/core';
import { useEffect, useRef } from 'react';

interface UseAppForegroundOptions {
  /**
   * Minimum time (ms) between executions
   * Prevents duplicate triggers from multiple events
   */
  throttleMs?: number;

  /**
   * Skip the first foreground event on initial mount
   */
  skipInitial?: boolean;
}

export function useAppForeground(
  callback: () => void | Promise<void>,
  options: UseAppForegroundOptions = {},
) {
  const { throttleMs = 500, skipInitial = false } = options;

  const lastRunRef = useRef<number>(0);
  const isFirstRunRef = useRef(true);

  const run = () => {
    const now = Date.now();

    if (skipInitial && isFirstRunRef.current) {
      isFirstRunRef.current = false;
      return;
    }

    if (now - lastRunRef.current < throttleMs) return;

    lastRunRef.current = now;
    callback();
  };

  const setUpListener = async () => {
    let capListener: PluginListenerHandle | undefined;

    // ✅ Capacitor native lifecycle
    if (Capacitor.isNativePlatform()) {
      capListener = await App.addListener('appStateChange', ({ isActive }) => {
        if (isActive) run();
      });
    }

    // Focus is omitted: it also fires when devtools takes focus and was
    // starting a second fetch on top of the visibility refetch.
    const onVisibilityChange = () => {
      if (!document.hidden) run();
    };

    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      capListener?.remove();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  };

  useEffect(() => {
    let remove = () => {};
    let disposed = false;

    void setUpListener().then((cleanup) => {
      if (disposed) cleanup();
      else remove = cleanup;
    });

    return () => {
      disposed = true;
      remove();
    };
  }, []);
}
