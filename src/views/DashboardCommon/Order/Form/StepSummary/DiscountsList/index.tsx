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
  codeDuration: number;
  showModal: (content: React.ReactNode) => void;
  successNotification: (text: string) => void;
  resetDiscountCode: () => void;
}

const DiscountsList = ({
  showModal,
  countedPrice,
  resetDiscountCode,
  successNotification,
  codeDiscount,
  codeDuration,
}: Props) => {
  const [priceName, setPriceName] = useState(countedPrice.name);
  const [helpText, setHelpText]: [boolean, any] = useState(false);

  const getText = () => {
    switch (countedPrice.name) {
      case 'firstRentFreePracing':
        if (codeDiscount !== 0) {
          setHelpText(true);
          resetDiscountCode();
          successNotification('notification.appliedBetterDiscount');
        }
        return setPriceName('application.firstRentFreePracing');
      case 'withDicoutnPricing':
        if (codeDiscount !== 0) {
          setHelpText(true);
          resetDiscountCode();
          successNotification('notification.appliedBetterDiscount');
        }
        return setPriceName('application.withDicoutnPricing');
      case 'cardPricing':
        setHelpText(false);
        return setPriceName('application.cardPricing');
      default:
        setHelpText(false);
        return setPriceName('application.standardPrice');
    }
  };

  useEffect(() => {
    getText();
    setHelpText(false);
  }, [countedPrice]);

  return (
    <div>
      <FormHeader title="application.usedPrice" />
      <div className="discount-wrapper">
        <p>{__(priceName)}</p>
        {countedPrice.name === 'cardPricing' && (
          <div className="card-pricing-details">
            <strong>{codeDiscount}%</strong> {__('application.forTime').toLowerCase()}{' '}
            <strong>
              {codeDuration} {__('application.weeksAmount')}
            </strong>
          </div>
        )}
        {helpText && <p>{__('notification.appliedBetterDiscount')}</p>}
      </div>
      <ButtonsContainer>
        <Button text="application.useDiscountCode" primary click={() => showModal(<DiscountCode />)} />
      </ButtonsContainer>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  countedPrice: state.order.countedPrice,
  codeDiscount: state.order.formData.card.discount,
  codeDuration: state.order.formData.card.durationInWeeks,
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
