import React, { useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { modal, order } from '../../../../../../../actions';
import { Button } from '../../../../../../../components/Common';
import { ButtonsContainer } from '../../../../../../../components/Layout';
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

  const dataToRender: any[] = [];
  for (const bank in bankList) {
    dataToRender.push(bankList[bank]);
  }

  const handleChange = (event: any) => {
    setPayment({
      id: event.target.value,
    });
  };

  return (
    <>
      <div className="bank-list-wrapper">
        {dataToRender.map((bank: any) => (
          <div key={bank.id}>
            <input type="radio" id={`payment-${bank.id}`} name="paymentType" value={bank.id} onChange={handleChange} />
            <label className="single-bank" key={bank.id} htmlFor={`payment-${bank.id}`}>
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
