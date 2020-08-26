import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from '../../../../../../../components/Common';
import { ButtonsContainer } from '../../../../../../../components/Layout';
import { ApplicationState } from '../../../../../../../reducers';

import './BankListModal.scss';

interface Props {
  bankList: any;
}

const BankListModal = ({ bankList }: Props) => {
  console.log('bankList', bankList);

  const dataToRender = [];

  for (const bank in bankList) {
    dataToRender.push(bankList[bank]);
  }

  console.log('dataToRender', dataToRender);

  return (
    <>
      <div className="bank-list-wrapper">
        {dataToRender.map((bank: any) => (
          <>
            <input type="radio" id={`payment-${bank.id}`} name="paymentType" value="email" />
            <label className="single-bank" key={bank.id} htmlFor={`payment-${bank.id}`}>
              <div className="img-wrapper">
                <img src={bank.img} alt="bank-img" />
              </div>
            </label>
          </>
        ))}
      </div>
      <ButtonsContainer max>
        <Button text="Wybierz" primary />
      </ButtonsContainer>
    </>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  bankList: state.order.bankList,
});

const mapDispatchToProps = (dispatch: any) => bindActionCreators({}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(BankListModal);
