import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import FormHeader from '../../../../../../components/Layout/FormHeader';
import { ButtonsContainer } from '../../../../../../components/Layout';
import { Button } from '../../../../../../components/Common';
import { modal, notifications, order } from '../../../../../../actions';
import { __ } from '../../../../../../helpers/i18n';
import { ApplicationState } from '../../../../../../reducers';

import DiscountCode from './DiscountCode';

import './DiscountsList.scss';
import { resetDiscountCode } from '../../../../../../actions/order';

interface Props {
  countedPrice: {
    name: string;
    value: number;
  };
  codeDiscount: number;
  showModal: (content: React.ReactNode) => void;
  successNotification: (text: string) => void;
  resetDiscountCode: () => void;
}

const DiscountsList = ({ showModal, countedPrice, resetDiscountCode, successNotification, codeDiscount }: Props) => {
  const [priceName, setPriceName] = useState(countedPrice.name);
  const [helpText, setHelpText]: [boolean, any] = useState(false);

  const getText = () => {
    switch (countedPrice.name) {
      case 'firstRentFreePracing':
        if (codeDiscount !== 0) {
          setHelpText(true);
          resetDiscountCode();
          successNotification(
            'Zastosowano korzystniejszą promocje. Kod nie został użyty. Można go wykorzystać ponownie.',
          );
        }
        return setPriceName(__('application.firstRentFreePracing'));
      case 'withDicoutnPricing':
        if (codeDiscount !== 0) {
          setHelpText(true);
          resetDiscountCode();
          successNotification(
            'Zastosowano korzystniejszą promocje. Kod nie został użyty. Można go wykorzystać ponownie.',
          );
        }
        return setPriceName(__('application.withDicoutnPricing'));
      case 'cardPricing':
        setHelpText(false);
        return setPriceName(__('application.cardPricing'));
      default:
        setHelpText(false);
        return setPriceName(__('application.standardPrice'));
    }
  };

  useEffect(() => {
    getText();
    setHelpText(false);
  }, [countedPrice]);

  return (
    <div>
      <FormHeader title={__('application.usedDiscount')} />
      <div className="discount-wrapper">
        <p>{priceName}</p>
        {helpText && <p>Zastosowano korzystniejszą promocje. Kod nie został użyty. Można go wykorzystać ponownie.</p>}
      </div>
      <ButtonsContainer>
        <Button text='application.useDiscountCode' primary click={() => showModal(<DiscountCode />)} />
      </ButtonsContainer>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  countedPrice: state.order.countedPrice,
  codeDiscount: state.order.formData.card.discount,
});

const mapDispatchToProps = (dispatch: any) =>
  bindActionCreators(
    {
      ...modal,
      ...notifications,
      ...order,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(DiscountsList);
