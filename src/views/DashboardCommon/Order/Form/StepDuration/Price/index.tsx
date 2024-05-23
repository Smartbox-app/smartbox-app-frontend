import React from 'react';
import styled from 'styled-components';
import { formatPrice } from '../../../../../../utils/format-price';
import {__} from "../../../../../../helpers/i18n";
import './Price.scss';

interface Props {
  countedPrice: number;
  isGross: boolean;
}

const StyledPrice = styled.strong`
  color: ${props => props.theme.colors.primary};
  font-size: 1.2rem;
`

const Price = ({ countedPrice, isGross }: Props) => (
  <div className="price-wrapper">
    <p>
        {isGross ? __('application.priceForSelectedPeriod') : __('application.netPriceForSelectedPeriod')}{' '}<StyledPrice>{formatPrice(countedPrice)}</StyledPrice>
    </p>
  </div>
);

export default Price;
