import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { Switch, Route } from 'react-router';

import { UserRes } from 'smartbox-types';
import UserService from '../../../../services/user-service';
import { ApplicationState } from '../../../../reducers';

import StepStock from './StepStock';
import StepSize from './StepSize';
import StepDuration from './StepDuration';
import StepPayment from './StepPayment';
import StepAgreement from './StepAgreement';
import StepSummary from './StepSummary';

interface Props {
    user: UserRes | null;
}

const Form = ({ user }: Props) => {
    if (!user) return null;
    return (
        <Switch>
            <Route path={`/${UserService.getSlugByRole(user.role)}/order/step/stock/:rentId?`} component={StepStock} />
            <Route path={`/${UserService.getSlugByRole(user.role)}/order/step/size/:rentId?`} component={StepSize} />
            <Route path={`/${UserService.getSlugByRole(user.role)}/order/step/duration/:rentId?`} component={StepDuration} />
            <Route path={`/${UserService.getSlugByRole(user.role)}/order/step/summary/:rentId?`} component={StepSummary} />
            <Route
                path={`/${UserService.getSlugByRole(user.role)}/order/step/agreement/:rentId?`}
                component={StepAgreement}
            />
            <Route path={`/${UserService.getSlugByRole(user.role)}/order/step/payment/:rentId?`} component={StepPayment} />
        </Switch>
    );
};

const mapStateToProps = (state: ApplicationState) => ({
    user: state.user.details,
});

export default connect(mapStateToProps)(Form);
