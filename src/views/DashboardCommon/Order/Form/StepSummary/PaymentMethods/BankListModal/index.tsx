import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { modal, order } from '../../../../../../../actions';
import { Button } from '../../../../../../../components/Common';
import { ButtonsContainer, SectionHeader } from '../../../../../../../components/Layout';
import { ApplicationState } from '../../../../../../../reducers';

import './BankListModal.scss';

interface Props {
  bankList: any;
  setPaymentMethod: (paymentId: string) => void;
  hideModal: () => void;
}

const BankListModal = ({ bankList, setPaymentMethod, hideModal }: Props) => {
  const [selectedPayment, setPayment] = useState({
    id: '',
  });

  const handleChange = (event: any) => {
    setPayment({
      id: event.target.value,
    });
  };

  return (
    <>
      <SectionHeader title="Proszę wybrać pośrednika:" />
      <div className="bank-list-wrapper">
        {bankList.map((bank: any) => (
          <div key={bank.id} className="single-bank">
            <input
              type="radio"
              id={`payment-${bank.id}`}
              name={`payment-${bank.id}`}
              value={bank.id}
              onChange={handleChange}
            />
            <label className="single-bank-label" htmlFor={`payment-${bank.id}`}>
              <div className="img-wrapper">
                <img src={bank.img} alt="bank-img" />
              </div>
            </label>
          </div>
        ))}
      </div>
      <ButtonsContainer max>
        <Button
          text="Wybierz"
          type="submit"
          disabled={selectedPayment.id === ''}
          primary
          click={() => {
            setPaymentMethod(selectedPayment.id);
            hideModal();
          }}
        />
      </ButtonsContainer>
    </>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  bankList: state.order.bankList,
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
