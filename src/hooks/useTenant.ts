import { useTenantContext } from '../providers/TenantProvider';

interface UseTenant {
  tenant: ReturnType<typeof useTenantContext>;
}

const useTenant = (): UseTenant => ({
  tenant: useTenantContext(),
});

export { useTenant };
