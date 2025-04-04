import React from 'react';
import { Switch, Route } from 'react-router';

import UserService from '../../../../services/user-service';

import StepStock from './StepStock';
import StepSize from './StepSize';
import StepDuration from './StepDuration';
import { StepPayment } from './StepPayment';
import StepAgreement from './StepAgreement';
import StepSummary from './StepSummary';
import StepExtensionDuration from './StepExtensionDuration';
import { useGetMyDetailsQuery } from 'src/queries';

export const Form = () => {
  const { data: user } = useGetMyDetailsQuery();
  if (!user) return null;
  return (
    <Switch>
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/order/step/stock/:rentId?`}
        component={StepStock}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/order/step/size/:rentId?`}
        component={StepSize}
      />
      <Route
        exact
        path={`/${UserService.getSlugByRole(user.role)}/order/step/duration/`}
        component={StepDuration}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/order/step/duration/:rentId`}
        component={StepExtensionDuration}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/order/step/summary/:rentId?`}
        component={StepSummary}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/order/step/agreement/:rentId?`}
        component={StepAgreement}
      />
      <Route
        path={`/${UserService.getSlugByRole(user.role)}/order/step/payment/:paymentId/:rentId?`}
        component={StepPayment}
      />
    </Switch>
  );
};
