import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { modal, order } from '../../../../../../../actions';
import { Spinner } from '../../../../../../../components/Common';
import { SectionHeader } from '../../../../../../../components/Layout';
import { ApplicationState } from '../../../../../../../reducers';

import './BankListModal.scss';
import {__} from "../../../../../../../helpers/i18n";

interface Props {
  loading: boolean;
  bankList: any[];
  setPaymentMethod: (paymentId: string) => void;
  hideModal: () => void;
}

const BankListModal = ({ loading, bankList, setPaymentMethod, hideModal }: Props) => {
  const handleChange = (event: any) => {
    setPaymentMethod(event.target.value);
  };

  return (
    <>
      <SectionHeader title='application.pleaseChoose' />
      <div className="bank-list-wrapper">
        {bankList.map((bank: any) => (
          <label key={bank.id} className="single-bank" htmlFor={`payment-${bank.id}`}>
            <input
              type="radio"
              id={`payment-${bank.id}`}
              name="bank-picked"
              value={bank.id}
              onChange={handleChange}
              onClick={() => hideModal()}
            />
            <div className="img-wrapper">{loading ? <Spinner /> : <img src={bank.img} alt="bank-img" />}</div>
          </label>
        ))}
      </div>
    </>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  bankList: state.order.bankList,
  selectedPaymentMethodDetail: state.order.selectedPaymentMethodDetail,
  loading: state.spinner.loading,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
      ...order,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(BankListModal);
