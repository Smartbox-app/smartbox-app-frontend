import React from 'react';
import { formatPrice } from '../../../../../../utils/format-price';

import './Price.scss';
import {__} from "../../../../../../helpers/i18n";

interface Props {
  countedPrice: number;
}

const Price = ({ countedPrice }: Props) => (
  <div className="price-wrapper">
    <p>
        {__('application.priceForSelectedPeriod')}{' '}<strong>{formatPrice(countedPrice)}</strong>
    </p>
  </div>
);

export default Price;
