import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { Preferences } from '@capacitor/preferences';

import { SignedDownloadUrlRes } from 'smartbox-types';
import ApiService from 'src/services/api-service';

export const isSignedStorageUrl = (url: string) =>
  url.includes('storage.googleapis.com') || url.includes('X-Goog-');

export const toAuthenticatedApiPath = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    const apiBase = new URL(ApiService.url);

    if (parsed.origin !== apiBase.origin) return null;

    return `${parsed.pathname}${parsed.search}`;
  } catch {
    return null;
  }
};

export const loadSignedDownloadUrl = async (
  downloadUrl: SignedDownloadUrlRes,
): Promise<string> => {
  const { url } = downloadUrl;

  if (isSignedStorageUrl(url)) {
    return url;
  }

  const apiPath = toAuthenticatedApiPath(url);
  if (!apiPath) {
    return url;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (Capacitor.isNativePlatform()) {
    const token = await Preferences.get({ key: 'smst_token' });
    headers.Authorization = `Bearer ${token.value}`;
  }

  const response = await fetch(
    `${ApiService.url}${ApiService.wrapUrlWithTenant(apiPath)}`,
    {
      method: 'GET',
      headers,
      credentials: !Capacitor.isNativePlatform() ? 'include' : undefined,
    },
  );

  if (!response.ok) {
    throw new Error('failed_to_load_signed_download_url');
  }

  const blob = await response.blob();
  return URL.createObjectURL(blob);
};

export const openSignedDownloadUrl = async (
  downloadUrl: SignedDownloadUrlRes,
) => {
  const url = await loadSignedDownloadUrl(downloadUrl);
  if (Capacitor.isNativePlatform()) {
    Browser.open({ url });
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  if (url.startsWith('blob:')) {
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }
};
