import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FormHeader from '../../../../../../components/Layout/FormHeader';
import { ButtonsContainer } from '../../../../../../components/Layout';
import { Button } from '../../../../../../components/Common';
import { modal } from '../../../../../../actions';
import { __ } from '../../../../../../helpers/i18n';
import { ApplicationState } from '../../../../../../reducers';

import RadioDiscount from './RadioDiscount';
import DiscountCode from './DiscountCode';

import './DiscountsList.scss';

interface Props {
  register: any;
  discountsList: any[];
  countedPrice: {
    name: string;
    value: number;
  };
  showModal: (content: React.ReactNode) => void;
}

const DiscountsList = ({ register, showModal, discountsList, countedPrice }: Props) => {
  const dataToDisplay = discountsList.map((data: any) => (
    <RadioDiscount key={data.text} text={data.text} value={data.value} register={register} />
  ));

  const getText = () => {
    switch (countedPrice.name) {
      case 'firstRentFreePracing':
        return 'Rabat pierwszego wynajmu';
      case 'withDicoutnPricing':
        return 'Standardowa cena';
      case 'cardPricing':
        return 'cardPricing';
      default:
        return 'Standardowa cena';
    }
  };

  return (
    <div>
      <FormHeader title={__('application.usedDiscount')} />
      <div className="radio-discount-wrapper">{getText()}</div>
      <ButtonsContainer>
        <Button text={__('application.useDiscountCode')} primary click={() => showModal(<DiscountCode />)} />
      </ButtonsContainer>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  discountsList: state.order.discountList,
  countedPrice: state.order.countedPrice,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(DiscountsList);
