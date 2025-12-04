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

interface Props {
  children: React.ReactNode;
}

const AppWrapper = ({ children }: Props) => {
  const { data: user, isLoading } = useGetMyDetailsQuery();
  const { mutate: logout } = useLogoutMutation();
  const { data: version, error } = useGetVersionQuery();
  const location = useLocation();
  const tenant = useSelector((state: ApplicationState) => state.tenant);
  const [isMaintenanceScreen, setIsMaintenanceScreen] =
    useState<boolean>(false);

  useEffect(() => {
    const currentVersion = localStorage.getItem('v') || null;

    if (!version) return;

    if (currentVersion !== version) {
      localStorage.setItem('v', version);
      window.location.reload();
    }
  }, [version]);

  useEffect(() => {
    if (user && user.tenantId && tenant) {
      if (user.tenantId !== tenant.id) {
        logout();
      }
    }
  }, [user, tenant]);

  useEffect(() => {
    if (!tenant || tenant.identifier !== 'rentbox') return;

    const tagManagerArgs = {
      gtmId: 'GTM-PR56955H',
    };

    TagManager.initialize(tagManagerArgs);
  }, [tenant]);

  useEffect(() => {
    scrollTop();
  }, [location.pathname]);

  useEffect(() => {
    if (error || !tenant) setIsMaintenanceScreen(true);
    if (version) setIsMaintenanceScreen(false);
  }, [version, error, tenant]);

  if (!version && isLoading) return <Spinner />;

  if (isMaintenanceScreen) return <MaintenanceScreen />;
  if (isLoading || (user && user.tenantId && (!tenant || !tenant.id)))
    return null;

  return <>{children}</>;
};

export { AppWrapper };
