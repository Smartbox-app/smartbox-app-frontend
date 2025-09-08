import { __ } from 'src/helpers/i18n';
import { useTenant } from './useTenant';
import { useCallback } from 'react';

export const useTenantNaming = () => {
  const { tenant } = useTenant();

  const getText = useCallback((key: string) => {
    if (!tenant || !tenant.namingType) return __(`naming.stock.${key}`);
    return __(`naming.${tenant.namingType}.${key}`);
  }, []);

  return {
    getText,
  };
};
