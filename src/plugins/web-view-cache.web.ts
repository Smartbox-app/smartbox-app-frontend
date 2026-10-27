import type { WebViewCachePlugin } from 'src/plugins/web-view-cache';

export class WebViewCacheWeb implements WebViewCachePlugin {
  async clear(): Promise<void> {
    // No-op on web — cache busting is handled via service workers in AppWrapper.
  }

  async clearAll(): Promise<void> {
    // No-op on web.
  }
}
