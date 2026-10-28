import React, { useMemo } from 'react';
import styled from 'styled-components';

import { AddonRes, CalculatedPriceRes, PriceDisplayForClients } from 'smartbox-types';
import { Header } from 'src/components/ui';
import { __ } from 'src/helpers/i18n';
import { OrderAddon } from 'src/reducers/order-reducer';
import { colorOrDark } from 'src/utils/color';
import { dateOnlyLocalTime } from 'src/utils/format-date';
import { formatPrice } from 'src/utils/format-price';
import { openEndedNextInvoiceDate } from 'src/utils/open-ended-period';
import { sumAddonPricesPerPeriod } from 'src/utils/summary-period-prices';

import { SelectedVariant } from './SelectedVariant';

import './SummaryTable.scss';

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

const StyledDetailsRow = styled.li`
  font-size: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  border-bottom: 1px solid #eee;
  padding: 8px 0;
`;

const StyledRentPrice = styled('div')`
  font-size: 14px;
  font-weight: 300;
`;

interface Props {
  dateStart: Date;
  dateEnd: Date;
  countedPrice: CalculatedPriceRes['price'];
  addons?: AddonRes[];
  orderAddons?: { [addonId: string]: OrderAddon };
  isOpenEnded?: boolean;
  periodDays?: number;
  invoiceDaysBefore?: number;
}

const SummaryTable = ({
  dateStart,
  dateEnd,
  countedPrice,
  addons,
  orderAddons,
  isOpenEnded,
  periodDays,
  invoiceDaysBefore,
}: Props) => {
  const addonsPricesPerPeriod = useMemo(
    () => sumAddonPricesPerPeriod(orderAddons ? Object.values(orderAddons) : []),
    [orderAddons],
  );

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
        return (
          <>
            <strong>
              {formatPrice(rentPricesPerPeriod[0].gross)}{' '}
              {__('application.gross')}
            </strong>
            /{formatPrice(rentPricesPerPeriod[0].net)} {__('application.net')}
          </>
        );
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
    if (isOpenEnded) {
      switch (countedPrice[0].display) {
        case PriceDisplayForClients.gross:
          return __('application.grossPriceForPeriod');
        case PriceDisplayForClients.net:
          return __('application.netPriceForPeriod');
        case PriceDisplayForClients.both:
          return __('application.priceForPeriod');
      }
    }

    switch (countedPrice[0].display) {
      case PriceDisplayForClients.gross:
        return __('application.grossPayment');
      case PriceDisplayForClients.net:
        return __('application.netPayment');
      case PriceDisplayForClients.both:
        return __('application.payment');
    }
  }, [countedPrice, isOpenEnded]);

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
            <Header variant="h2">
              {isOpenEnded
                ? __('application.firstPeriodFinishTerm')
                : __('application.finishTerm')}
            </Header>
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
      {isOpenEnded ? (
        <StyledRentPrice>
          {__('application.openEndedPeriodInfo', {
            days: periodDays || 30,
          })}{' '}
          {__('application.openEndedNextInvoice', {
            invoiceDate: dateOnlyLocalTime(
              openEndedNextInvoiceDate(dateEnd, invoiceDaysBefore || 7),
            ),
          })}
        </StyledRentPrice>
      ) : null}
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
