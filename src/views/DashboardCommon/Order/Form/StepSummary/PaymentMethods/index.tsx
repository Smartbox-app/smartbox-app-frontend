import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { PaymentType } from 'smartbox-types';
import { modal, order } from '../../../../../../actions';
import FormHeader from '../../../../../../components/Layout/FormHeader';
import { ApplicationState } from '../../../../../../reducers';

import './PaymentMethods.scss';
import {__} from "../../../../../../helpers/i18n";
import styled from 'styled-components';

const StyledInput = styled.input`
&:checked + .payment-label {
  border: 1px solid ${props => props.theme.colors.primary};
}

`

interface Props {
  selectedPaymentMethod: {
    id: string;
    name: string;
    img: string;
  };
  saveBanks: () => void;
  showModal: (content: React.ReactNode) => void;
  pickPaymentType: (payment: any) => void;
  register?: any;
}

const PaymentMethods = ({ showModal, saveBanks, selectedPaymentMethod, register, pickPaymentType }: Props) => {
  useEffect(() => {
    saveBanks();
  }, []);

  const selectedPayment = () => {
    if (selectedPaymentMethod.id === '') {
      return (
        <>
          <div className="label-img">
            <ReactSVG src="/assets/icons/wallet.svg" />
          </div>
          <span>{__('application.others')}</span>
        </>
      );
    } else {
      return (
        <>
          <div className="label-img">
            <img className="payment-img" src={selectedPaymentMethod.img} alt="LogoBanku" />
          </div>
          <span>{selectedPaymentMethod.name}</span>
        </>
      );
    }
  };

  return (
    <div>
      <FormHeader title='application.paymentMethods' />
      <div className="payment-methods-wrapper">
        <label htmlFor="paymentTypeCard">
          <StyledInput
            type="radio"
            id="paymentTypeCard"
            name="paymentType"
            value={PaymentType.card}
            ref={register({ required: true })}
            onChange={(event: any) => pickPaymentType(Number(event.target.value))}
          />
          <div className="payment-label">
            <div className="label-img">
              <ReactSVG src="/assets/icons/credit-card.svg" />
            </div>
            <span>{__('application.creditCard')}</span>
          </div>
        </label>

        <label htmlFor="paymentTypeBank">
          <input
            type="radio"
            id="paymentTypeBank"
            name="paymentType"
            value={PaymentType.transfer}
            ref={register({ required: true })}
            onChange={(event: any) => pickPaymentType(Number(event.target.value))}
          />

          <div className="payment-label">{selectedPayment()}</div>
        </label>
      </div>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  bankList: state.order.bankList,
  selectedPaymentMethod: state.order.selectedPaymentMethodDetail,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...order,
      ...modal,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(PaymentMethods);
