import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { TenantForUsers } from 'smartbox-types';
import { setTenant as setTenantAction } from '../actions/tenant';
import { useGetTenantQuery } from 'src/queries/useGetTenantQuery';

interface UseTenant {
  tenant: TenantForUsers | null;
}

const useTenant = (): UseTenant => {
  const dispatch = useDispatch();
  const { data: tenant } = useGetTenantQuery();

  useEffect(() => {
    if (tenant) {
      dispatch(setTenantAction(tenant));
    }
  }, [tenant, dispatch]);

  return {
    tenant: tenant ?? null,
  };
};

export { useTenant };
