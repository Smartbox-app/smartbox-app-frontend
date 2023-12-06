import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import FormHeader from '../../../../../../components/Layout/FormHeader';
import { ButtonsContainer } from '../../../../../../components/Layout';
import { Button } from '../../../../../../components/Branded';
import { modal } from '../../../../../../actions';
import { __ } from '../../../../../../helpers/i18n';
import { ApplicationState } from '../../../../../../reducers';

import { DiscountCode } from './DiscountCode';

import './DiscountsList.scss';
import { resetDiscountCode } from '../../../../../../actions/order';

interface Props {
  stockId: string;
}

const DiscountsList = ({ stockId }: Props) => {
  const { calculatedPriceDetails, startDate, endDate, discountCode } = useSelector((state: ApplicationState) => state.order);
  const dispatch = useDispatch();

  return (
    <div>
      <FormHeader title="application.usedPrice" />
      <div className="discount-wrapper">
        {calculatedPriceDetails.length === 0 && <p>{__('application.standardPrice')}</p>}
        {calculatedPriceDetails.map((detail, index) => <p key={index}>{detail}</p>)}

      </div>
      <ButtonsContainer>
        {!discountCode && <Button text="application.useDiscountCode" primary click={() => dispatch(modal.showModal(<DiscountCode rentStart={startDate} rentEnd={endDate} stockId={stockId} />))} />}
        {discountCode && <Button text="application.deleteDiscountCode" primary click={() => dispatch(resetDiscountCode())} />}
      </ButtonsContainer>
    </div>
  );
};


export { DiscountsList }
