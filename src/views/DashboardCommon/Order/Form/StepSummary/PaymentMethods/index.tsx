import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ReactSVG } from 'react-svg';
import { modal, order } from '../../../../../../actions';
import FormHeader from '../../../../../../components/Layout/FormHeader';
import { ApplicationState } from '../../../../../../reducers';

import BankListModal from './BankListModal';

import './PaymentMethods.scss';

interface Props {
  bankList: [];
  getBankList: () => void;
  showModal: (content: React.ReactNode) => void;
}

const PaymentMethods = ({ showModal, getBankList, bankList }: Props) => {
  useEffect(() => {
    // getBankList(); //TODO need to handle cors
  }, []);

  return (
    <div>
      <FormHeader title="Metody płatności:" />
      <div className="payment-methods-wrapper">
        <input type="radio" id="contactChoice1" name="paymentType" value="email" />
        <label className="payment-label" htmlFor="contactChoice1">
          <ReactSVG src={`/assets/icons/credit-card.svg`} />
          <span>Karta płatnicza</span>
        </label>

        <input type="radio" id="contactChoice2" name="paymentType" value="phone" />
        <label className="payment-label" htmlFor="contactChoice2">
          <ReactSVG src={`/assets/icons/credit-card.svg`} />
          <span>Blik</span>
        </label>

        <input type="radio" id="contactChoice3" name="paymentType" value="mail" />
        <label className="payment-label" htmlFor="contactChoice3" onClick={() => showModal(<BankListModal />)}>
          <ReactSVG src={`/assets/icons/wallet.svg`} />
          <span>Przelew</span>
        </label>
      </div>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  bankList: state.order.bankList,
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
