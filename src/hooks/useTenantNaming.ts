import { useCallback } from 'react';
import { NamingType } from 'smartbox-types';

import { buildNamingResourceKey, useI18n } from 'src/i18n';
import type { NamingTypeKey } from 'src/i18n/types/keys';

import { useTenant } from './useTenant';

export const useTenantNaming = () => {
  const { tenant } = useTenant();
  const { t } = useI18n();

  const getText = useCallback(
    (key: NamingTypeKey) => {
      const namingType = tenant?.namingType ?? NamingType.Stock;
      return t(buildNamingResourceKey(namingType, key));
    },
    [tenant?.namingType, t],
  );

  return {
    getText,
  };
};
