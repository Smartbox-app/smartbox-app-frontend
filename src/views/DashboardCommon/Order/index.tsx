import React from 'react';
import { Route, Switch } from 'react-router';

import StepAgreement from './Form/StepAgreement';
import StepDuration from './Form/StepDuration';
import StepExtensionDuration from './Form/StepExtensionDuration';
import { StepPayment } from './Form/StepPayment';
import StepSize from './Form/StepSize';
import StepStock from './Form/StepStock';
import StepSummary from './Form/StepSummary';
import { QuickContact } from './QuickContact';
import { RouteWithIndicator } from './RouteWithIndicator';
import { useOrderPaths } from './useOrderPaths';

export const Order = () => {
  const { routes } = useOrderPaths();
  if (!routes) return null;

  return (
    <RouteWithIndicator>
      <Switch>
        <Route exact path={routes.stock} component={StepStock} />
        <Route path={routes.extensionDuration} component={StepExtensionDuration} />
        <Route path={routes.extensionSummary} component={StepSummary} />
        <Route path={routes.extensionAgreement} component={StepAgreement} />
        <Route path={routes.extensionPayment} component={StepPayment} />
        <Route path={routes.duration} component={StepDuration} />
        <Route path={routes.summary} component={StepSummary} />
        <Route path={routes.agreement} component={StepAgreement} />
        <Route path={routes.payment} component={StepPayment} />
        <Route exact path={routes.size} component={StepSize} />
      </Switch>
      <QuickContact />
    </RouteWithIndicator>
  );
};
