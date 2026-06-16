import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { TenantForUsers } from 'smartbox-types';
import { setTenant as setTenantAction } from '../../actions/tenant';
import { useGetTenantQuery } from 'src/queries/useGetTenantQuery';

const TenantContext = createContext<TenantForUsers | null>(null);

interface Props {
  children: React.ReactNode;
}

const TenantProvider = ({ children }: Props) => {
  const dispatch = useDispatch();
  const { data: tenant } = useGetTenantQuery();

  useEffect(() => {
    if (tenant) {
      dispatch(setTenantAction(tenant));
    }
  }, [tenant, dispatch]);

  return (
    <TenantContext.Provider value={tenant ?? null}>
      {children}
    </TenantContext.Provider>
  );
};

const useTenantContext = () => useContext(TenantContext);

export { TenantProvider, useTenantContext };
