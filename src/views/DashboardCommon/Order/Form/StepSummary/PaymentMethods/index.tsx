import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { modal, order } from '../../../../../../actions';
import FormHeader from '../../../../../../components/Layout/FormHeader';
import { ApplicationState } from '../../../../../../reducers';
import { MainPaymentWay } from '../../../../../../reducers/order-reducer';

import BankListModal from './BankListModal';

import './PaymentMethods.scss';

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
          <ReactSVG src="/assets/icons/wallet.svg" />
          <span>Inne</span>
        </>
      );
    } else {
      return (
        <>
          <img className="payment-img" src={selectedPaymentMethod.img} alt="LogoBanku" />
          <span>{selectedPaymentMethod.name}</span>
        </>
      );
    }
  };

  return (
    <div>
      <FormHeader title="Metody płatności:" />
      <div className="payment-methods-wrapper">
        <label htmlFor="paymentTypeCard">
          <input
            type="radio"
            id="paymentTypeCard"
            name="paymentType"
            value={MainPaymentWay.card}
            ref={register({ required: true })}
            onChange={(event: any) => pickPaymentType(Number(event.target.value))}
          />
          <div className="payment-label">
            <ReactSVG src="/assets/icons/credit-card.svg" />
            <span>Karta płatnicza</span>
          </div>
        </label>

        <label htmlFor="paymentTypeBlik">
          <input
            type="radio"
            id="paymentTypeBlik"
            name="paymentType"
            value={MainPaymentWay.blik}
            ref={register({ required: true })}
            onChange={(event: any) => pickPaymentType(Number(event.target.value))}
          />
          <div className="payment-label">
            <img className="payment-img" src="/assets/images/150.png" alt="LogoBanku" />
            <span>Blik</span>
          </div>
        </label>

        <label htmlFor="paymentTypeBank" onClick={() => showModal(<BankListModal />)}>
          <input
            type="radio"
            id="paymentTypeBank"
            name="paymentType"
            value={MainPaymentWay.other}
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
