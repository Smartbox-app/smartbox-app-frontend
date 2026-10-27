import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { history } from 'src/history';
import { useGetMyDetailsQuery } from 'src/queries';
import { ApplicationState } from 'src/reducers';
import UserService from 'src/services/user-service';
import { PaymentForm } from './PaymentForm';

import './StepPayment.scss';

export const StepPayment = () => {
  const { data: user } = useGetMyDetailsQuery();
  const order = useSelector((state: ApplicationState) => state.order);
  const { rentId } = useParams<{ rentId?: string }>();
  useEffect(() => {
    if (!order.boxGroupId && !rentId) {
      if (!user) return;
      history.push(`/${UserService.getSlugByRole(user.role)}/order/step/stock`);
    }
  }, []);

  return <PaymentForm />;
};
