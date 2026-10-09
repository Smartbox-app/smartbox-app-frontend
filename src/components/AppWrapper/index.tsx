import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useGetVersionQuery, useGetMyDetailsQuery } from '../../queries';
import { useLogoutMutation } from 'src/mutations/useLogoutMutation';
import { useLocation } from 'react-router';
import { scrollTop } from 'src/utils/scroll-top';
import { Spinner } from '../Branded';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { App } from '@capacitor/app';
import { showModal } from '../../actions/modal';
import { AppOutdatedModal } from './components/AppOutdatedModal';
import { AppMaintenanceModal } from './components/AppMaintenanceModal';
import { useTenant } from '../../hooks/useTenant';
import { useTracking } from '../../hooks/useTracking';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { Preferences } from '@capacitor/preferences';
import styled from 'styled-components';
import { history } from 'src/history';
import { queryClient } from 'src/query-client';
import { clearUserSession } from 'src/actions/auth';
import { order } from 'src/actions';
import { withAttributionSearch } from 'src/utils/attribution-params';
import {
  clearPreloadReloadFlag,
  reloadWithoutServiceWorker,
} from 'src/utils/reload-without-service-worker';

interface Props {
  children: React.ReactNode;
}

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const INACTIVE_PATH = '/inactive';

const AppWrapper = ({ children }: Props) => {
  const dispatch = useDispatch();
  const { data: user, isLoading } = useGetMyDetailsQuery();
  const { mutate: logout } = useLogoutMutation();
  const { data: config } = useGetVersionQuery();
  const location = useLocation();
  const { tenant } = useTenant();
  useTracking({ initialize: true });
  const versionReloadTriggeredRef = useRef(false);

  const handleWebVersion = (newConfig: { versions: string[] }) => {
    const latestVersion = newConfig?.versions?.[0];
    if (!latestVersion) return;

    const currentVersion = localStorage.getItem('v');
    if (currentVersion === latestVersion) {
      clearPreloadReloadFlag();
      return;
    }
    if (versionReloadTriggeredRef.current) return;

    versionReloadTriggeredRef.current = true;
    localStorage.setItem('v', latestVersion);
    reloadWithoutServiceWorker();
  };

  const handleAndroidVersion = (
    newConfig: { versions: string[] },
    version: string,
  ) => {
    if (
      newConfig.versions.length > 0 &&
      !newConfig.versions.includes(version)
    ) {
      dispatch(showModal(<AppOutdatedModal platform="android" />, false, true));
    }
  };

  const handleIOSVersion = (
    newConfig: { versions: string[] },
    version: string,
  ) => {
    if (
      newConfig.versions.length > 0 &&
      !newConfig.versions.includes(version)
    ) {
      dispatch(showModal(<AppOutdatedModal platform="ios" />, false, true));
    }
  };

  const handleConfig = async (newConfig: {
    versions: string[];
    isMaintenance: boolean;
  }) => {
    if (!newConfig) return;
    if (newConfig.isMaintenance) {
      dispatch(showModal(<AppMaintenanceModal />, false, true));
      return;
    }

    if (Capacitor.isNativePlatform()) {
      const { platform } = await Device.getInfo();
      const { version } = await App.getInfo();
      if (platform === 'android') {
        handleAndroidVersion(newConfig, version);
      } else {
        handleIOSVersion(newConfig, version);
      }
    } else {
      handleWebVersion(newConfig);
    }
  };

  useEffect(() => {
    if (!config) return;
    handleConfig(config);
  }, [config?.versions?.[0], config?.isMaintenance]);

  const verifyNativeToken = async () => {
    const token = await Preferences.get({ key: 'smst_token' });
    if (!token) {
      logout();
    }
  };

  useEffect(() => {
    if (user && user.tenantId && tenant) {
      if (user.tenantId !== tenant.id) {
        logout();
      }
    }

    if (Capacitor.isNativePlatform()) {
      verifyNativeToken();
    }
  }, [user, tenant]);

  const initGoogleAuth = async () => {
    try {
      await SocialLogin.initialize({
        google: {
          webClientId: import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID, // Required for Android and Web
          iOSClientId: import.meta.env[
            `VITE_GOOGLE_IOS_${tenant?.identifier.toUpperCase()}_CLIENT_ID`
          ], // Required for iOS
          iOSServerClientId: import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID, // Required for iOS offline mode and server authorization (same as webClientId)
          mode: 'online', // 'online' or 'offline'
        },
        facebook: {
          appId: import.meta.env.VITE_META_CLIENT_ID,
          clientToken: import.meta.env.VITE_META_CLIENT_TOKEN,
        },
      });
    } catch (e) {
      console.error('INIT ERROR', e);
    }
  };

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    initGoogleAuth();
  }, []);

  useEffect(() => {
    scrollTop();
  }, [location.pathname]);

  useEffect(() => {
    if (!tenant) return;

    const onInactivePath = location.pathname === INACTIVE_PATH;

    if (onInactivePath && !!tenant.active) {
      history.replace(withAttributionSearch('/login'));
    }

    if (onInactivePath && !tenant.active) return;

    if (tenant.active === false) {
      queryClient.setQueryData(['my-details'], null);
      dispatch(clearUserSession());
      dispatch(order.clearOrder());

      if (Capacitor.isNativePlatform()) {
        Preferences.clear();
      }

      history.replace(INACTIVE_PATH);

      return;
    }
  }, [tenant?.active, tenant?.id, dispatch, location.pathname]);

  if (!config && isLoading)
    return (
      <SpinnerContainer>
        <Spinner />
      </SpinnerContainer>
    );

  if (isLoading || (user && user.tenantId && (!tenant || !tenant.id)))
    return null;

  return <>{children}</>;
};

export { AppWrapper };
