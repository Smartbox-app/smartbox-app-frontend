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
  countedPrice: {
    name: string;
    value: number;
  };
  showModal: (content: React.ReactNode) => void;
}

const DiscountsList = ({ showModal, countedPrice }: Props) => {

  const getText = () => {
    switch (countedPrice.name) {
      case 'firstRentFreePracing':
        return __('application.firstRentFreePracing');
      case 'withDicoutnPricing':
        return __('application.withDicoutnPricing');
      case 'cardPricing':
        return __('application.cardPricing');
      default:
        return __('application.standardPrice');
    }
  };

  return (
    <div>
      <FormHeader title={__('application.usedDiscount')} />
      <div className="discount-wrapper">{getText()}</div>
      <ButtonsContainer>
        <Button text={__('application.useDiscountCode')} primary click={() => showModal(<DiscountCode />)} />
      </ButtonsContainer>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
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
