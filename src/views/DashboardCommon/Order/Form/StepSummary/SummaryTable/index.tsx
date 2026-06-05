import { useMemo } from 'react';
import { formatPrice } from '../../../../../../utils/format-price';
import {
  dateOnly,
  dateOnlyLocalTime,
} from '../../../../../../utils/format-date';

import './SummaryTable.scss';
import { __ } from '../../../../../../helpers/i18n';
import styled from 'styled-components';
import { darken } from 'polished';
import { AddonRes, PriceDisplayForClients } from 'smartbox-types';
import { OrderAddon } from '../../../../../../reducers/order-reducer';
import { SelectedVariant } from './SelectedVariant';
import { colorOrDark } from '../../../../../../utils/color';
import { Header, Section } from 'src/components/ui';
import React from 'react';

const StyledCell = styled.div`
  color: ${(props) => colorOrDark(props.theme.colors.primary)};
`;

const StyledRow = styled.div`
  border-bottom: 1px solid #fbfbfb;
`;

const StyledDetailsList = styled.ul`
  list-style-type: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledDetailsRow = styled.li(
  ({ theme }) => `
    font-size: 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    border-bottom: 1px solid #eee;
    padding: 8px 0;
`,
);

const StyledRentPrice = styled('div')`
  font-size: 14px;
  font-weight: 300;
`;

interface Props {
  dateStart: Date;
  dateEnd: Date;
  countedPrice: {
    value: number;
    isGross: boolean;
    display: PriceDisplayForClients;
    grossPrice: number;
    netPrice: number;
  }[];
  addons?: AddonRes[];
  orderAddons?: { [addonId: string]: OrderAddon };
}

const SummaryTable = ({
  dateStart,
  dateEnd,
  countedPrice,
  addons,
  orderAddons,
}: Props) => {
  const addonsPricesPerPeriod = useMemo(() => {
    if (!orderAddons) return [];
    const everyAddonPricePerPeriod: { net: number; gross: number }[] = [];
    for (const addon of Object.values(orderAddons)) {
      const pricePerPeriod = (addon.price || []).map((price) => ({
        net: price.netPrice,
        gross: price.grossPrice,
      }));

      for (let i = 0; i < pricePerPeriod.length; i++) {
        if (!everyAddonPricePerPeriod[i]) {
          everyAddonPricePerPeriod[i] = { net: 0, gross: 0 };
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
    return countedPrice.map((price) => ({
      net: price.netPrice,
      gross: price.grossPrice,
    }));
  }, [countedPrice]);

  const firstPeriodPrice = useMemo(() => {
    switch (countedPrice[0].display) {
      case PriceDisplayForClients.gross:
        return <strong>{formatPrice(rentPricesPerPeriod[0].gross)}</strong>;
      case PriceDisplayForClients.net:
        return <strong>{formatPrice(rentPricesPerPeriod[0].net)}</strong>;
      case PriceDisplayForClients.both:
        return <><strong>{formatPrice(rentPricesPerPeriod[0].gross)} {__('application.gross')}</strong>/{formatPrice(rentPricesPerPeriod[0].net)} {__('application.net')}</>;
    }
  }, [rentPricesPerPeriod, countedPrice]);

  const fullPrice = useMemo(() => {
    const netFullPrice =
      (addonsPricesPerPeriod[0]?.net || 0) + rentPricesPerPeriod[0].net;
    const grossFullPrice =
      (addonsPricesPerPeriod[0]?.gross || 0) + rentPricesPerPeriod[0].gross;

    switch (countedPrice[0].display) {
      case PriceDisplayForClients.gross:
        return formatPrice(grossFullPrice);
      case PriceDisplayForClients.net:
        return formatPrice(netFullPrice);
      case PriceDisplayForClients.both:
        return (
          <div>
            {formatPrice(grossFullPrice)} {__('application.gross')}{' '}
            <div className="price-net">
              {formatPrice(netFullPrice)} {__('application.net')}
            </div>
          </div>
        );
    }
  }, [rentPricesPerPeriod, addonsPricesPerPeriod, countedPrice]);

  const rentPriceTitle = useMemo(() => {
    switch (countedPrice[0].display) {
      case PriceDisplayForClients.gross:
        return __('application.grossPaymentForRent');
      case PriceDisplayForClients.net:
        return __('application.netPaymentForRent');
      case PriceDisplayForClients.both:
        return __('application.paymentForRent');
    }
  }, [countedPrice]);

  const fullPriceTitle = useMemo(() => {
    switch (countedPrice[0].display) {
      case PriceDisplayForClients.gross:
        return __('application.grossPayment');
      case PriceDisplayForClients.net:
        return __('application.netPayment');
      case PriceDisplayForClients.both:
        return __('application.payment');
    }
  }, [countedPrice]);

  console.log('COUNTED PRICE', countedPrice);

  return (
    <>
      <div className="order-summary-wrapper">
        <StyledRow className="row">
          <StyledCell className="cell">
            <Header variant="h2">{__('application.startTerm')}</Header>
          </StyledCell>
          <StyledCell className="cell fat">
            <span>{dateOnlyLocalTime(dateStart)}</span>
          </StyledCell>
        </StyledRow>
        <StyledRow className="row">
          <StyledCell className="cell">
            <Header variant="h2">{__('application.finishTerm')}</Header>
          </StyledCell>
          <StyledCell className="cell fat">
            <span>{dateOnlyLocalTime(dateEnd)}</span>
          </StyledCell>
        </StyledRow>
        <StyledRow className="row">
          <StyledCell className="cell">
            <Header variant="h2">{fullPriceTitle}</Header>
          </StyledCell>
          <StyledCell className="cell fat">{fullPrice}</StyledCell>
        </StyledRow>
      </div>
      <Header variant="h2">{__('application.priceDetails')}</Header>
      <StyledDetailsList>
        <StyledDetailsRow>
          <Header variant="h3">{rentPriceTitle}</Header>
          <StyledRentPrice>{firstPeriodPrice}</StyledRentPrice>
        </StyledDetailsRow>
        {addons && orderAddons
          ? addons
              .filter((addon) => !addon.noPricing)
              .map((addon) => (
                <StyledDetailsRow key={addon.id}>
                  <SelectedVariant
                    addonName={addon.name}
                    addonId={addon.id}
                    addons={addons}
                    orderAddons={orderAddons}
                  />
                </StyledDetailsRow>
              ))
          : null}
      </StyledDetailsList>
    </>
  );
};

export default SummaryTable;
