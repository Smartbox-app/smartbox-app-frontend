import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FormHeader from '../../../../../../components/Layout/FormHeader';
import { ButtonsContainer } from '../../../../../../components/Layout';
import { Button } from '../../../../../../components/Common';
import { modal } from '../../../../../../actions';
import { ApplicationState } from '../../../../../../reducers';

import RadioDiscout from './RadioDiscout';
import DiscoutCode from './DiscountCode';

import './DiscountsList.scss';

interface Props {
  register: any;
  discoutsList: any[];
  showModal: (content: React.ReactNode) => void;
}

const DiscountsList = ({ register, showModal, discoutsList }: Props) => {
  const dataToDisplay = discoutsList.map((data: any) => (
    <RadioDiscout key={data.text} text={data.text} value={data.value} register={register} />
  ));

  return (
    <div>
      <FormHeader title="Zastosowane rabaty:" />
      <div className="discounts-list-wrapper">{dataToDisplay}</div>
      <ButtonsContainer>
        <Button text="Dodaj kod rabatowy" primary click={() => showModal(<DiscoutCode />)} />
      </ButtonsContainer>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  discoutsList: state.order.discountList,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(DiscountsList);
