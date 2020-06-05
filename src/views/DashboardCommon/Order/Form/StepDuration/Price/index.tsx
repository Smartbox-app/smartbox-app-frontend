import React from 'react';
import { formatPrice } from '../../../../../../utils/format-price';

import './Price.scss';

interface Props {
  countedPrice: number;
}

const Price = ({ countedPrice }: Props) => (
  <div className="price-wrapper">
    <p>
      Cena za wybrany okres to: <strong>{formatPrice(countedPrice)}</strong>
    </p>
  </div>
);

export default Price;
