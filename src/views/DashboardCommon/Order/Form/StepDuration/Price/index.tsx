import React from 'react';
import styled from 'styled-components';
import { formatPrice } from '../../../../../../utils/format-price';
import {__} from "../../../../../../helpers/i18n";
import './Price.scss';

interface Props {
  countedPrice: number;
}

const StyledPrice = styled.strong`
  color: ${props => props.theme.colors.primary};
  font-size: 1.2rem;
`

const Price = ({ countedPrice }: Props) => (
  <div className="price-wrapper">
    <p>
        {__('application.priceForSelectedPeriod')}{' '}<StyledPrice>{formatPrice(countedPrice)}</StyledPrice>
    </p>
  </div>
);

export default Price;
