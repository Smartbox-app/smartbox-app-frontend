import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { modal, order } from '../../../../../../../actions';
import { Button } from '../../../../../../../components/Common';
import { ButtonsContainer, SectionHeader } from '../../../../../../../components/Layout';
import { ApplicationState } from '../../../../../../../reducers';

import './BankListModal.scss';

interface Props {
  bankList: any[];
  selectedPaymentMethodDetail: any;
  setPaymentMethod: (paymentId: string) => void;
  hideModal: () => void;
}

const BankListModal = ({ bankList, setPaymentMethod, selectedPaymentMethodDetail, hideModal }: Props) => {
  const handleChange = (event: any) => {
    setPaymentMethod(event.target.value);
  };

  return (
    <>
      <SectionHeader title="Proszę wybrać:" />
      <div className="bank-list-wrapper">
        {bankList.map((bank: any) => (
          <label key={bank.id} className="single-bank" htmlFor={`payment-${bank.id}`}>
            <input type="radio" id={`payment-${bank.id}`} name="bank-picked" value={bank.id} onChange={handleChange} />
            <div className="img-wrapper">
              <img src={bank.img} alt="bank-img" />
            </div>
          </label>
        ))}
      </div>
      <ButtonsContainer max>
        <Button
          text="Wybierz"
          type="submit"
          disabled={selectedPaymentMethodDetail.id === ''}
          primary
          click={(): void => {
            hideModal();
          }}
        />
      </ButtonsContainer>
    </>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  bankList: state.order.bankList,
  selectedPaymentMethodDetail: state.order.selectedPaymentMethodDetail,
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
