import * as Sentry from '@sentry/react';
import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import App from 'src/App';
import 'src/i18n/i18n';
import ApiService from 'src/services/api-service';
import { isLocalEnvironment } from 'src/utils/environment';
import { getMobileBuildId } from 'src/utils/mobile-build-id';
import { beginPreloadReload } from 'src/utils/reload-without-service-worker';
import { syncNativeWebBundleCache } from 'src/utils/sync-native-web-bundle-cache';
import { unregisterServiceWorkersIfNative } from 'src/utils/unregister-service-workers';

import 'font-awesome/css/font-awesome.min.css';
import 'src/index.scss';

window.addEventListener('vite:preloadError', () => {
  if (!beginPreloadReload()) return;

  const url = new URL(window.location.href);
  if (url.searchParams.get('sb-recover') === '1') return;
  url.searchParams.set('sb-recover', '1');
  window.location.replace(url.toString());
});

const bootstrap = async () => {
  unregisterServiceWorkersIfNative();

  const mobileBuildId = getMobileBuildId();
  if (mobileBuildId) {
    window.__MOBILE_BUILD_ID__ = mobileBuildId;
  }

  const reloaded = await syncNativeWebBundleCache();
  if (reloaded) {
    return;
  }

  if (!isLocalEnvironment()) {
    Sentry.init({
      dsn: 'https://9093709c7c66b68dd936c1317550042f@o4511569107288064.ingest.de.sentry.io/4511569204609104',
    });
  }

  const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement,
  );

  ApiService.setUrl();

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
};

bootstrap();
