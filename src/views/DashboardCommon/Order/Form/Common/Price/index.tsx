import React, { useMemo } from 'react';
import styled from 'styled-components';
import { formatPrice } from '../../../../../../utils/format-price';
import { __ } from "../../../../../../helpers/i18n";

import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../../../../reducers';

import './Price.scss';
import { colorOrDark } from '../../../../../../utils/color';

const StyledPrice = styled.strong`
  color: ${props => colorOrDark(props.theme.colors.primary)};
  font-size: 1.2rem;
`

const Price = () => {
  const { calculatedPrice, orderAddons } = useSelector((state: ApplicationState) => state.order);

  const fullPrice = useMemo(() => {
    const addonsPrice = Object.values(orderAddons).reduce((acc, curr) => acc + (curr.price ? curr.price.value : 0), 0);
    return addonsPrice + calculatedPrice.value;
  }, [calculatedPrice, orderAddons])

  return (
    <div className="price-wrapper">
      <p>
        {calculatedPrice.isGross ? __('application.priceForSelectedPeriod') : __('application.netPriceForSelectedPeriod')}{' '}<StyledPrice>{formatPrice(fullPrice)}</StyledPrice>
      </p>
    </div>
  )
}

export default Price;
