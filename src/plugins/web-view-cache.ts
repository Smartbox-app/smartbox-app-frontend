import { registerPlugin } from '@capacitor/core';

export interface WebViewCachePlugin {
  /** Clears WebView HTTP cache only (e.g. dev web bundle rebuild). */
  clear(): Promise<void>;
  /** Clears WebView cache + data + app cache dirs (e.g. store app update). */
  clearAll(): Promise<void>;
}

export const WebViewCache = registerPlugin<WebViewCachePlugin>('WebViewCache', {
  web: () => import('src/plugins/web-view-cache.web').then((m) => new m.WebViewCacheWeb()),
});
