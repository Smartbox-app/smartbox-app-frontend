import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import * as Sentry from '@sentry/react';
import './i18n/i18n';
import './index.scss';
import 'font-awesome/css/font-awesome.min.css';
import App from './App';
import ApiService from './services/api-service';
import { unregisterServiceWorkersIfNative } from './utils/unregister-service-workers';
import { getMobileBuildId } from './utils/mobile-build-id';
import { syncNativeWebBundleCache } from './utils/sync-native-web-bundle-cache';
import { isLocalEnvironment } from './utils/environment';

const bootstrap = async () => {
  unregisterServiceWorkersIfNative();

  const mobileBuildId = getMobileBuildId();
  console.log('MOBILE BUILD ID', mobileBuildId);
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
