import React, { useEffect } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { connect, useSelector } from 'react-redux';
import { UserRes } from 'smartbox-types';
import UserService from '../../../../../services/user-service';
import { ApplicationState } from '../../../../../reducers';
import { history } from '../../../../../App';

import './StepPayment.scss';
import { PaymentForm } from './PaymentForm';

interface Props {
    user: UserRes | null;
}

const StepPayment = ({ user }: Props) => {
    const order = useSelector((state: ApplicationState) => state.order);
    const { rentId } = useParams<{ rentId?: string }>();
    useEffect(() => {
        if (!order.boxGroupId && !rentId) {
            if (!user) return;
            history.push(`/${UserService.getSlugByRole(user.role)}/order/step/stock`);
        }
    }, []);

    return <PaymentForm />
};

const mapStateToProps = (state: ApplicationState) => ({
    user: state.user.details,
});


export default withRouter(connect(mapStateToProps)(StepPayment));
