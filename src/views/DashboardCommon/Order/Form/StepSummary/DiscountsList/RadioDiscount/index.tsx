import React from 'react';
import { connect } from 'react-redux';

import { IPricingResult } from 'smartbox-types';
import { ApplicationState } from '../../../../../../../reducers';

import './RadioDiscount.scss';

interface Props {
  text: string;
  value: number;
  register?: any;
  countedPrice?: IPricingResult;
}

const RadioDiscount = ({ value, text, register, countedPrice }: Props) => {
  const getName = (data: string): string => {
    switch (data) {
      case 'withoutDiscountPricing':
        return 'Standardowa cena';
      case 'withDicoutnPricing':
        return `Zastosowano rabat: ${countedPrice?.value}%`;
      default:
        return 'Standardowa cena';
    }
  };
  return (
    <div className="radio-discount-wrapper">
      <input name="discount" type="radio" value={value} id={text} />
      <label htmlFor={text} className="discount-option">
        {getName(text)}
      </label>
    </div>
  );
};

const mapStateToProps = (state: ApplicationState) => ({
  countedPrice: state.order.countedPrice,
});

export default connect(mapStateToProps)(RadioDiscount);
