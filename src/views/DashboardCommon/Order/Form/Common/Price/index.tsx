import React, { useMemo } from 'react';
import styled from 'styled-components';
import { formatPrice } from '../../../../../../utils/format-price';
import { __ } from '../../../../../../helpers/i18n';

import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../../../../reducers';

import './Price.scss';
import { Header, Section } from 'src/components/ui';
import { differenceInDays } from 'date-fns';

const StyledPrice = styled.strong`
  font-size: 40px;
`;

const Price = () => {
  const { calculatedPrice, orderAddons, startDate, endDate, rentPaymentType } =
    useSelector((state: ApplicationState) => state.order);

    const addonsPricesPerPeriod = useMemo(() => {
      const everyAddonPricePerPeriod: number[] = [];
      for(const addon of Object.values(orderAddons)) {
        const pricePerPeriod = (addon.price || []).map(price => price.value);

        for(let i = 0; i < pricePerPeriod.length; i++) {
          everyAddonPricePerPeriod[i] = (everyAddonPricePerPeriod[i] || 0) + pricePerPeriod[i]
        }
        }
      
        return everyAddonPricePerPeriod;
    }, [orderAddons])

    const rentPricesPerPeriod = useMemo(() => {
      return calculatedPrice.map(price => price.value);
    }, [calculatedPrice])

  const toPayNow = useMemo(() => {
    if (!endDate || !startDate) return null;
console.log('PRICES', rentPricesPerPeriod, addonsPricesPerPeriod);
   return rentPricesPerPeriod[0] + (addonsPricesPerPeriod[0] || 0);

  }, [addonsPricesPerPeriod, rentPricesPerPeriod]);

  return (
    <Section>
      <Header variant="h2">
        {calculatedPrice[0].isGross
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
