import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useGetVersionQuery, useGetMyDetailsQuery } from '../../queries';
import { useLogoutMutation } from 'src/mutations/useLogoutMutation';
import { useLocation } from 'react-router';
import { scrollTop } from 'src/utils/scroll-top';
import TagManager from 'react-gtm-module';
import { Spinner } from '../Branded';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { App } from '@capacitor/app';
import { showModal } from '../../actions/modal';
import { AppOutdatedModal } from './components/AppOutdatedModal';
import { AppMaintenanceModal } from './components/AppMaintenanceModal';
import { useTenant } from '../../hooks/useTenant';
import { SocialLogin } from '@capgo/capacitor-social-login';
import { Preferences } from '@capacitor/preferences';
import styled from 'styled-components';

interface Props {
  children: React.ReactNode;
}

const SpinnerContainer = styled.div`  
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const AppWrapper = ({ children }: Props) => {
  const dispatch = useDispatch();
  const { data: user, isLoading } = useGetMyDetailsQuery();
  const { mutate: logout } = useLogoutMutation();
  const { data: config, error } = useGetVersionQuery();
  const location = useLocation();
  const { tenant } = useTenant();
  const [isMaintenanceScreen, setIsMaintenanceScreen] =
    useState<boolean>(false);

  const handleWebVersion = (newConfig: { versions: string[] }) => {
    const currentVersion = localStorage.getItem('v') || null;

    if (!config) return;

    if (!currentVersion || !config.versions.includes(currentVersion)) {
      localStorage.setItem('v', config.versions[0]);

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .getRegistrations()
          .then(function (registrations) {
            //returns installed service workers
            if (registrations.length) {
              Promise.all(
                registrations.map((registration) => registration.unregister()),
              ).then(function () {
                window.location.reload();
              });
            } else {
              window.location.reload();
            }
          });
      } else {
        window.location.reload();
      }
    }
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
    handleConfig(config);
  }, [config]);

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
    console.log('TRYING TO INIT GOOGLE AUTH');

    console.log(
      'TRYING TO INIT FACEBOOK AUTH META',
      JSON.stringify(import.meta.env),
    );
    try {
      await SocialLogin.initialize({
        google: {
          webClientId: import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID, // Required for Android and Web
          iOSClientId: import.meta.env[`VITE_GOOGLE_IOS_${tenant?.identifier.toUpperCase()}_CLIENT_ID`], // Required for iOS
          iOSServerClientId: import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID, // Required for iOS offline mode and server authorization (same as webClientId)
          mode: 'online', // 'online' or 'offline'
        },
        facebook: {
          appId: import.meta.env.VITE_META_CLIENT_ID,
          clientToken: import.meta.env.VITE_META_CLIENT_TOKEN,
        },
      });
    } catch (e) {
      console.log('INIT ERROR', e);
    }
  };

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    initGoogleAuth();
  }, []);

  useEffect(() => {
    if (!tenant || !['rentbox', 'kielceboxy'].includes(tenant.identifier))
      return;

    let tagManagerArgs = {};

    switch (tenant.identifier) {
      case 'rentbox': {
        tagManagerArgs = {
          gtmId: 'GTM-PR56955H',
        };
        break;
      }
      case 'kielceboxy': {
        tagManagerArgs = {
          gtmId: 'GTM-WBS77MJS',
        };
        break;
      }
    }

    TagManager.initialize(tagManagerArgs);
  }, [tenant]);

  useEffect(() => {
    scrollTop();
  }, [location.pathname]);

  useEffect(() => {
    if (error) setIsMaintenanceScreen(true);
    if (config) setIsMaintenanceScreen(false);
  }, [config, error]);

  if (!config && isLoading) return <SpinnerContainer><Spinner /></SpinnerContainer>;

  // if (isMaintenanceScreen) return <MaintenanceScreen />;

  if (isLoading || (user && user.tenantId && (!tenant || !tenant.id)))
    return null;

  return <>{children}</>;
};

export { AppWrapper };
