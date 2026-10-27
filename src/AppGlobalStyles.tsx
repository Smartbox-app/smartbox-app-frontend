import React from 'react';

import { GlobalFont, GlobalStyle } from 'src/globalStyles';
import { useTenant } from 'src/hooks/useTenant';

export const AppGlobalStyles = () => {
  const { tenant } = useTenant();
  return (
    <>
      {tenant ? <GlobalFont tenantId={tenant.id} /> : null}
      <GlobalStyle tenant={tenant} />
    </>
  );
};
