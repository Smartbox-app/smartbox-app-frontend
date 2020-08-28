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
  bankList: [];
  getBankList: () => void;
  selectedPaymentMethod: {
    id: string;
    name: string;
    img: string;
  };
  showModal: (content: React.ReactNode) => void;
  register?: any;
}

const PaymentMethods = ({ showModal, getBankList, bankList, selectedPaymentMethod, register }: Props) => {
  useEffect(() => {
    getBankList(); //TODO need to handle cors
  }, []);

  const slectedPayment = () => {
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
        <input
          type="radio"
          id="contactChoice1"
          name="paymentType"
          value={MainPaymentWay.card}
          ref={register({ required: true })}
        />
        <label className="payment-label" htmlFor="contactChoice1">
          <ReactSVG src={`/assets/icons/credit-card.svg`} />
          <span>Karta płatnicza</span>
        </label>

        <input
          type="radio"
          id="contactChoice2"
          name="paymentType"
          value={MainPaymentWay.blik}
          ref={register({ required: true })}
        />
        <label className="payment-label" htmlFor="contactChoice2">
          <img className="payment-img" src="/assets/images/150.png" alt="LogoBanku" />
          <span>Blik</span>
        </label>

        <input
          type="radio"
          id="contactChoice3"
          name="paymentType"
          value={MainPaymentWay.other}
          ref={register({ required: true })}
        />
        <label className="payment-label" htmlFor="contactChoice3" onClick={() => showModal(<BankListModal />)}>
          {slectedPayment()}
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
