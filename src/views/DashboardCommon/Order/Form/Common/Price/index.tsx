import React, { useMemo } from 'react';
import styled from 'styled-components';
import { formatPrice } from '../../../../../../utils/format-price';
import { __ } from '../../../../../../helpers/i18n';

import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../../../../reducers';

import './Price.scss';
import { colorOrDark } from '../../../../../../utils/color';
import { Header, Section } from 'src/components/ui';
import { differenceInDays } from 'date-fns';

const StyledPrice = styled.strong`
  font-size: 40px;
`;

const Price = () => {
  const { calculatedPrice, orderAddons, startDate, endDate, rentPaymentType } =
    useSelector((state: ApplicationState) => state.order);

  const fullPrice = useMemo(() => {
    const addonsPrice = Object.values(orderAddons).reduce(
      (acc, curr) => acc + (curr.price ? curr.price.value : 0),
      0,
    );
    return addonsPrice + calculatedPrice.value;
  }, [calculatedPrice, orderAddons]);

  const toPayNow = useMemo(() => {
    if (!endDate || !startDate) return null;

    if(!rentPaymentType || rentPaymentType === 'in-advance') return fullPrice;

    const durationDays = differenceInDays(endDate, startDate) + 1;
    const numberOfPeriods = Math.ceil(durationDays / 30);
    const baseCost = Math.ceil((fullPrice / numberOfPeriods) * 100) / 100;

    return baseCost;
  }, [startDate, endDate, fullPrice, rentPaymentType]);

  return (
    <Section>
      <Header variant="h2">
        {calculatedPrice.isGross
          ? __('application.priceForSelectedPeriod')
          : __('application.netPriceForSelectedPeriod')}
      </Header>
      {toPayNow ? <StyledPrice>{formatPrice(toPayNow)}</StyledPrice> : null}
      {rentPaymentType === 'installments' ? <p>Zaprezentowana kwota to wartość pierwszego okresu wynajmu.</p> : null}
    </Section>
  );
};

export default Price;
