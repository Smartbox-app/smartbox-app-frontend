import { TenantForClients, TenantForUsers } from 'smartbox-types';
import { useGetTenantQuery } from 'src/queries/useGetTenantQuery';

interface UseTenant {
  tenant: TenantForUsers | TenantForClients | null;
}

const useTenant = (): UseTenant => {
  const { data: tenant } = useGetTenantQuery();

  return {
    tenant: tenant ?? null,
  };
};

export { useTenant };
