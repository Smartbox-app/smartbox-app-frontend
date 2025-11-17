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
    console.log('ADDONS COST', addonsPrice);
    return addonsPrice + calculatedPrice.value;
  }, [calculatedPrice, orderAddons]);

  const toPayNow = useMemo(() => {
    if (!endDate || !startDate) return null;

    if (!rentPaymentType || rentPaymentType === 'in-advance') return fullPrice;

    const durationDays = differenceInDays(endDate, startDate) + 1;
    const numberOfPeriods = Math.ceil(durationDays / 30);

    const baseAddonsCosts = {};

    for (let addonId of Object.keys(orderAddons)) {
      const addon = orderAddons[addonId];
      baseAddonsCosts[addonId] =
        Math.floor(
          (Number(addon.price ? addon.price.value : 0) / numberOfPeriods) * 100,
        ) / 100;
    }

    const allAddonsBaseSum = Object.keys(baseAddonsCosts).reduce(
      (acc, curr) => acc + baseAddonsCosts[curr],
      0,
    );

    const baseRentCost =
      Math.floor((calculatedPrice.value / numberOfPeriods) * 100) / 100;
    return baseRentCost + allAddonsBaseSum;
  }, [startDate, endDate, calculatedPrice, rentPaymentType, orderAddons]);

  return (
    <Section>
      <Header variant="h2">
        {calculatedPrice.isGross
          ? __('application.priceForSelectedPeriod')
          : __('application.netPriceForSelectedPeriod')}
      </Header>
      {toPayNow ? <StyledPrice>{formatPrice(toPayNow)}</StyledPrice> : null}
      {rentPaymentType === 'installments' ? (
        <p>Zaprezentowana kwota to wartość pierwszego okresu wynajmu.</p>
      ) : null}
    </Section>
  );
};

export default Price;
