import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FormHeader from '../../../../../../components/Layout/FormHeader';
import { ButtonsContainer } from '../../../../../../components/Layout';
import { Button } from '../../../../../../components/Common';
import { modal } from '../../../../../../actions';
import { ApplicationState } from '../../../../../../reducers';

import RadioDiscount from './RadioDiscount';
import DiscountCode from './DiscountCode';

import './DiscountsList.scss';

interface Props {
  register: any;
  discountsList: any[];
  showModal: (content: React.ReactNode) => void;
}

const DiscountsList = ({ register, showModal, discountsList }: Props) => {
  const dataToDisplay = discountsList.map((data: any) => (
    <RadioDiscount key={data.text} text={data.text} value={data.value} register={register} />
  ));

  return (
    <div>
      <FormHeader title="Zastosowane rabaty:" />
      <div className="discounts-list-wrapper">{dataToDisplay}</div>
      <ButtonsContainer>
        <Button text="Dodaj kod rabatowy" primary click={() => showModal(<DiscountCode />)} />
      </ButtonsContainer>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  discountsList: state.order.discountList,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(DiscountsList);
