import { App } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';
import { WebViewCache } from '../plugins/web-view-cache';
import { getMobileBuildId } from './mobile-build-id';

const NATIVE_BUILD_KEY = 'native_build_version';
const WEB_BUNDLE_KEY = 'web_bundle_id';

type StoredVersions = {
  nativeBuild: string | null;
  webBundle: string | null;
};

const readStoredVersions = async (): Promise<StoredVersions> => {
  const [native, web, legacyCombined] = await Promise.all([
    Preferences.get({ key: NATIVE_BUILD_KEY }),
    Preferences.get({ key: WEB_BUNDLE_KEY }),
    Preferences.get({ key: 'web_bundle_version' }),
  ]);

  if (native.value !== null && web.value !== null) {
    return {
      nativeBuild: native.value,
      webBundle: web.value,
    };
  }

  if (legacyCombined.value?.includes(':')) {
    const [legacyNative, legacyWeb] = legacyCombined.value.split(':');
    await Preferences.remove({ key: 'web_bundle_version' });

    return {
      nativeBuild: legacyNative ?? null,
      webBundle: legacyWeb ?? null,
    };
  }

  return {
    nativeBuild: native.value,
    webBundle: web.value,
  };
};

const saveStoredVersions = async (
  nativeBuild: string,
  webBundle: string,
): Promise<void> => {
  await Promise.all([
    Preferences.set({ key: NATIVE_BUILD_KEY, value: nativeBuild }),
    Preferences.set({ key: WEB_BUNDLE_KEY, value: webBundle }),
  ]);
};

/**
 * Secondary safety net after the WebView loads (Android clears earlier in MainActivity).
 *
 * On Android, WebBundleVersionSync runs before index.html is loaded, so a cached
 * index.html cannot block clearing. This JS check handles iOS and any post-load edge cases.
 *
 * Returns true when a reload was triggered and the app should not continue booting.
 */
export const syncNativeWebBundleCache = async (): Promise<boolean> => {
  if (!Capacitor.isNativePlatform()) {
    return false;
  }

  const { build: nativeBuild } = await App.getInfo();
  const webBundle = getMobileBuildId() ?? 'release';

  const stored = await readStoredVersions();
  const isFirstLaunch =
    stored.nativeBuild === null && stored.webBundle === null;
  const nativeUpdated =
    stored.nativeBuild !== null && stored.nativeBuild !== nativeBuild;
  const webBundleUpdated =
    stored.webBundle !== null && stored.webBundle !== webBundle;

  if (
    !isFirstLaunch &&
    !nativeUpdated &&
    !webBundleUpdated &&
    stored.nativeBuild === nativeBuild &&
    stored.webBundle === webBundle
  ) {
    return false;
  }

  if (nativeUpdated) {
    try {
      await WebViewCache.clearAll();
    } catch (error) {
      console.warn('Failed to clear WebView data and cache', error);
    }
  } else if (webBundleUpdated) {
    try {
      await WebViewCache.clear();
    } catch (error) {
      console.warn('Failed to clear WebView cache', error);
    }
  }

  await saveStoredVersions(nativeBuild, webBundle);

  if (nativeUpdated || webBundleUpdated) {
    window.location.reload();
    return true;
  }

  return false;
};
