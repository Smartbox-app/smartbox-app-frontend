import React from 'react';
import { GlobalFont, GlobalStyle } from './globalStyles';
import { useTenant } from './hooks/useTenant';

export const AppGlobalStyles = () => {
  const { tenant } = useTenant();
  return (
    <>
      {tenant ? <GlobalFont tenantId={tenant.id} /> : null}
      <GlobalStyle tenant={tenant} />
    </>
  );
};
