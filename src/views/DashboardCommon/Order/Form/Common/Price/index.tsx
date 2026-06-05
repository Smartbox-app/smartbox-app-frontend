import React, { useMemo } from 'react';
import styled from 'styled-components';
import { formatPrice } from '../../../../../../utils/format-price';
import { __ } from '../../../../../../helpers/i18n';

import { useSelector } from 'react-redux';
import { ApplicationState } from '../../../../../../reducers';

import './Price.scss';
import { Header, Section } from 'src/components/ui';
import { differenceInDays } from 'date-fns';
import { PriceDisplayForClients } from 'smartbox-types';
import { useI18n } from 'src/i18n';

const StyledPrice = styled.strong`
  font-size: 40px;
`;

const StyledPriceSmall = styled.span`
  font-size: 32px;
  fontweight: 400;
`;

const StyledPrices = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Price = () => {
  const { t } = useI18n();
  const { calculatedPrice, orderAddons, startDate, endDate, rentPaymentType } =
    useSelector((state: ApplicationState) => state.order);
  console.log('ORDER ADDONS', orderAddons);
  const addonsPricesPerPeriod = useMemo(() => {
    const everyAddonPricePerPeriod: { net: number; gross: number }[] = [];
    for (const addon of Object.values(orderAddons)) {
      const pricePerPeriod = (addon.price || []).map((price) => ({ net: price.netPrice, gross: price.grossPrice }));

      for (let i = 0; i < pricePerPeriod.length; i++) {
        if (!everyAddonPricePerPeriod[i]) {
          everyAddonPricePerPeriod[i] = {
            net: 0,
            gross: 0,
          };
        }
        everyAddonPricePerPeriod[i].net =
          (everyAddonPricePerPeriod[i].net || 0) + pricePerPeriod[i].net;
        everyAddonPricePerPeriod[i].gross =
          (everyAddonPricePerPeriod[i].gross || 0) + pricePerPeriod[i].gross;
      }
    }

    return everyAddonPricePerPeriod;
  }, [orderAddons]);

  const rentPricesPerPeriod = useMemo(() => {
    return calculatedPrice.map((price) => ({
      net: price.netPrice,
      gross: price.grossPrice,
    }));
  }, [calculatedPrice]);

  const toPayNow = useMemo(() => {
    if (!endDate || !startDate) return null;

    return {
      net:
        (rentPricesPerPeriod[0]?.net || 0) +
        (addonsPricesPerPeriod[0]?.net || 0),
      gross:
        (rentPricesPerPeriod[0]?.gross || 0) +
        (addonsPricesPerPeriod[0]?.gross || 0),
    };
  }, [addonsPricesPerPeriod, rentPricesPerPeriod]);

  const headerTitle = useMemo(() => {
    const { display } = calculatedPrice[0];
    switch (display) {
      case PriceDisplayForClients.gross:
        return __('application.grossPriceForSelectedPeriod');
      case PriceDisplayForClients.net:
        return __('application.netPriceForSelectedPeriod');
      case PriceDisplayForClients.both:
        return __('application.priceForSelectedPeriod');
    }
  }, [calculatedPrice]);

  const priceInfo = useMemo(() => {
    const { display } = calculatedPrice[0];

    if (!toPayNow) return null;
    switch (display) {
      case PriceDisplayForClients.gross:
        return <StyledPrice>{formatPrice(toPayNow?.gross || 0)}</StyledPrice>;
      case PriceDisplayForClients.net:
        return <StyledPrice>{formatPrice(toPayNow?.net || 0)}</StyledPrice>;
      case PriceDisplayForClients.both:
        return (
          <StyledPrices>
            <StyledPrice>
              {formatPrice(toPayNow?.gross || 0)} {t('application.gross')}
            </StyledPrice>
            <StyledPriceSmall>
              {formatPrice(toPayNow?.net || 0)} {t('application.net')}
            </StyledPriceSmall>
          </StyledPrices>
        );
    }
  }, [toPayNow]);

  return (
    <Section>
      <Header variant="h2">{headerTitle}</Header>
      {priceInfo}
      {rentPaymentType === 'installments' ? (
        <p>Zaprezentowana kwota to wartość pierwszego okresu wynajmu.</p>
      ) : null}
    </Section>
  );
};

export default Price;
