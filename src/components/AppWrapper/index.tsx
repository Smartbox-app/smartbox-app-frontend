import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '../../reducers';
import { useGetVersionQuery, useGetMyDetailsQuery } from '../../queries';
import { useLogoutMutation } from 'src/mutations/useLogoutMutation';
import { useLocation } from 'react-router';
import { scrollTop } from 'src/utils/scroll-top';
import TagManager from 'react-gtm-module';
import { MaintenanceScreen } from '../MaintenanceScreen';
import { Spinner } from '../Branded';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
import { App } from '@capacitor/app';
import { showModal } from '../../actions/modal';
import { AppOutdatedModal } from './components/AppOutdatedModal';
import { AppMaintenanceModal } from './components/AppMaintenanceModal';
import { useTenant } from '../../hooks/useTenant';

interface Props {
  children: React.ReactNode;
}

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
      window.location.reload();
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

  useEffect(() => {
    if (user && user.tenantId && tenant) {
      if (user.tenantId !== tenant.id) {
        logout();
      }
    }
  }, [user, tenant]);

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

  if (!config && isLoading) return <Spinner />;

  // if (isMaintenanceScreen) return <MaintenanceScreen />;

  if (isLoading || (user && user.tenantId && (!tenant || !tenant.id)))
    return null;

  return <>{children}</>;
};

export { AppWrapper };
