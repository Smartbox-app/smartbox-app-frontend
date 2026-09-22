import { createContext, useContext } from 'react';

type TenantSettingsContextValue = {
  userId?: string;
  tenantId?: string;
  basePath: string;
};

export const TenantSettingsContext = createContext<TenantSettingsContextValue>({
  basePath: '',
});

export const useTenantSettingsContext = () => useContext(TenantSettingsContext);
