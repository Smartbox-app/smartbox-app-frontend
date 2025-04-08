import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ApplicationState } from '../../reducers';
import { useGetVersionQuery, useGetMyDetailsQuery } from '../../queries';
import { useLogoutMutation } from 'src/mutations/useLogoutMutation';

interface Props {
  children: React.ReactNode;
}

const AppWrapper = ({ children }: Props) => {
  const { data: user, isLoading } = useGetMyDetailsQuery();
  const { mutate: logout } = useLogoutMutation();
  const { data: version } = useGetVersionQuery();
  const tenant = useSelector((state: ApplicationState) => state.tenant);

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
  if (isLoading || (user && user.tenantId && (!tenant || !tenant.id)))
    return null;

  return <>{children}</>;
};

export { AppWrapper };
