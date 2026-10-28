import React from 'react';
import { Switch, Route } from 'react-router';

import { useGetMyDetailsQuery } from 'src/queries';
import UserService from 'src/services/user-service';

import StepAgreement from './StepAgreement';
import StepDuration from './StepDuration';
import StepExtensionDuration from './StepExtensionDuration';
import { StepPayment } from './StepPayment';
import StepSize from './StepSize';
import StepStock from './StepStock';
import StepSummary from './StepSummary';

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
