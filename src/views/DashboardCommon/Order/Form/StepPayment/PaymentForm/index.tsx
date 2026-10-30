import React, { useEffect } from 'react';
import { useParams } from 'react-router';

import { Spinner } from 'src/components/Branded';
import { useTenant } from 'src/hooks/useTenant';
import { redirectToIpg } from 'src/utils/payment-form';

export const PaymentForm = () => {
  const { paymentId } = useParams<{ paymentId: string }>();
  const { tenant } = useTenant();

  useEffect(() => {
    if (!paymentId || !tenant?.id) return;
    redirectToIpg(tenant.id, paymentId);
  }, [paymentId, tenant?.id]);

  return <Spinner />;
};
