import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { UserRes } from 'smartbox-types';
import UserService from '../../../../../services/user-service';
import { ApplicationState } from '../../../../../reducers';
import { history } from 'src/history';

import './StepPayment.scss';
import { PaymentForm } from './PaymentForm';
import { useGetMyDetailsQuery } from 'src/queries';

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
