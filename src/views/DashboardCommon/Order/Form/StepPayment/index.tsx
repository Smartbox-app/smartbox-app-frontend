import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useOrderStep } from 'src/views/DashboardCommon/Order/RouteWithIndicator';
import { useOrderPaths } from 'src/views/DashboardCommon/Order/useOrderPaths';

import { PaymentForm } from './PaymentForm';

import './StepPayment.scss';

export const StepPayment = () => {
  useOrderStep('payment');
  const { goToStockSelect } = useOrderPaths();
  const { rentId, boxGroupId } = useParams<{
    rentId?: string;
    boxGroupId?: string;
  }>();
  useEffect(() => {
    if (!boxGroupId && !rentId) goToStockSelect();
  }, [boxGroupId, goToStockSelect, rentId]);

  return <PaymentForm />;
};
