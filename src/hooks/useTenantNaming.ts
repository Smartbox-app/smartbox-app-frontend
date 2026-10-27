import { useCallback } from 'react';

import { NamingType } from 'smartbox-types';
import { useTenant } from 'src/hooks/useTenant';
import { buildNamingResourceKey, useI18n } from 'src/i18n';
import type { Options } from 'src/i18n/types';
import type { NamingTypeKey } from 'src/i18n/types/keys';

export const useTenantNaming = () => {
  const { tenant } = useTenant();
  const { t } = useI18n();

  const getText = useCallback(
    (key: NamingTypeKey, options?: Options) => {
      const namingType = tenant?.namingType ?? NamingType.Stock;
      return t(buildNamingResourceKey(namingType, key), options);
    },
    [tenant?.namingType, t],
  );

  return {
    getText,
  };
};
