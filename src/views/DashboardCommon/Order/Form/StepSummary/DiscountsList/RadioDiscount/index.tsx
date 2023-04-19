import React from 'react';
import { connect } from 'react-redux';

import { IPricingResult } from 'smartbox-types';
import { ApplicationState } from '../../../../../../../reducers';

import './RadioDiscount.scss';
import {__} from "../../../../../../../helpers/i18n";

interface Props {
  text: string;
  value: number;
  register?: any;
  countedPrice?: IPricingResult;
}

const RadioDiscount = ({ value, text, register, countedPrice }: Props) => {
  const getName = (data: string): string => {
    switch (data) {
      case 'withDicoutnPricing':
        return `${__('application.usedDiscount')} ${countedPrice?.value}%`;
      case 'withoutDiscountPricing':
      default:
        return __('application.standardPrice');
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
