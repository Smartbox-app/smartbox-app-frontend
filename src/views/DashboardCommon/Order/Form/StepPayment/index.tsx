import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import { bindActionCreators } from 'redux';
import { connect, useSelector } from 'react-redux';
import { PaymentType, UserRes } from 'smartbox-types';
import { order, paymentStatus } from '../../../../../actions';
import UserService from '../../../../../services/user-service';
import { FormType } from '../../../../../types/order-form';
import { ApplicationState } from '../../../../../reducers';
import { history } from '../../../../../App';

import BankForm from './BankForm';
import CreditCardForm from './CreditCardForm';

import './StepPayment.scss';
import { PaymentForm } from './PaymentForm';

interface Props {
    user: UserRes | null;
    selectedPayment: PaymentType;
    resetPaymentForm: () => void;
}

const formToRender = (selectedPayment) => {
    switch (selectedPayment) {
        case PaymentType.card:
            return <CreditCardForm />;
        case PaymentType.blik:
            return <BankForm />; //TODO ?? Blik form gets strange error
        case PaymentType.transfer:
            return <BankForm />;
        default:
            return <CreditCardForm />;
    }
};

const StepPayment = ({ selectedPayment, user, resetPaymentForm }: Props) => {
    const order = useSelector((state: ApplicationState) => state.order);
    useEffect(() => {
        if (!order.boxGroupId) {
            if (!user) return;
            history.push(`/${UserService.getSlugByRole(user.role)}/order/step/stock`);
        }

        return () => {
            resetPaymentForm();
        };
    }, []);

    return <PaymentForm />
};

const mapStateToProps = (state: ApplicationState) => ({
    selectedPayment: state.order.selectedPayment,
    user: state.user.details,
});

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators(
        {
            ...order,
            ...paymentStatus,
        },
        dispatch,
    );

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(StepPayment));
