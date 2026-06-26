import React, { useMemo } from 'react';
import { BoxGroupUserRes } from 'smartbox-types';
import styled from 'styled-components';
import { __ } from '../../../../../../helpers/i18n';
import { formatPrice } from '../../../../../../utils/format-price';
import { PricingType } from 'smartbox-types';
import { getColorForBackground } from 'src/utils/color';
import { PriceDisplayForClients } from 'src/smartbox-types/stock/price-display-for-clients';

interface Props {
  disabled?: boolean;
  active?: boolean;
  box: BoxGroupUserRes;
}

const StyledPriceInfo = styled('div')<{ disabled?: boolean; active?: boolean }>(
  ({ theme, active, disabled }) => ({
    width: '100%',
    fontSize: 15,
    background: active ? theme.colors.primary : theme.colors.background.primary,
    borderRadius: theme.radius.innerSurface,
    color: active
      ? getColorForBackground(theme.colors.primary)
      : theme.colors.text.primary,
    padding: `${theme.spacing * 2}px ${theme.spacing * 2}px`,
    opacity: disabled ? 0.5 : 1,
    border: `2px solid ${active ? theme.colors.primary : theme.colors.border.secondary}`,
    whiteSpace: 'normal',
  }),
);

const formatQuantity = (type: PricingType, quantity: number) => {
  switch (type) {
    case PricingType.Day: {
      if (quantity > 1) return 'dni';
      return 'dzień';
    }
    case PricingType.Week: {
      if (quantity >= 5) return 'tygodni';
      if (quantity > 1) return 'tygodnie';
      return 'tydzień';
    }

    case PricingType.Month: {
      if (quantity >= 5) return 'miesięcy';
      if (quantity > 1) return 'miesiące';
      return 'miesiąc';
    }

    case PricingType.Quarter: {
      if (quantity >= 5) return 'kwartałów';
      if (quantity > 1) return 'kwartały';
      return 'kwartał';
    }

    case PricingType.HalfYear: {
      return 'pół roku';
    }

    case PricingType.Year: {
      if (quantity >= 5) return 'lat';
      if (quantity > 1) return 'lata';
      return 'rok';
    }
  }
};

const PriceInfo = ({ box, active, disabled }: Props) => {
  const firstPricing = box.pricing[0];

  if (!firstPricing.price || !firstPricing.quantity) return null;

  const { display, netPrice, grossPrice } = box.pricing[0];

  const priceInfo = useMemo(() => {
    switch (display) {
      case PriceDisplayForClients.gross:
        return (
          <strong>
            {__('application.rentFrom')}{' '}
            {formatPrice(firstPricing.grossPrice || 0)}{' '}
            {__('application.gross')}
          </strong>
        );
      case PriceDisplayForClients.net:
        return (
          <strong>
            {__('application.rentFrom')}{' '}
            {formatPrice(firstPricing.netPrice || 0)} {__('application.net')}
          </strong>
        );
      case PriceDisplayForClients.both:
        return (
          <>
            <strong>
              {__('application.rentFrom')}{' '}
              {formatPrice(firstPricing.grossPrice || 0)}{' '}
              {__('application.gross')}
            </strong>{' '}
            (
            <strong>
              {formatPrice(firstPricing.netPrice || 0)} {__('application.net')}
            </strong>
            )
          </>
        );
    }
  }, [display, netPrice, grossPrice]);

  return (
    <>
      {/* {disabled ? (
        <StyledPriceInfo active={active} disabled={disabled}>
          <strong>Brak</strong>
        </StyledPriceInfo>
      ) :  <StyledPriceInfo active={active} disabled={disabled}>
      <strong>Dostępny!</strong>
    </StyledPriceInfo>} */}
      <StyledPriceInfo active={active} disabled={disabled}>
        {priceInfo} /{' '}
        <span>
          {firstPricing.quantity}{' '}
          {formatQuantity(firstPricing.type, firstPricing.quantity || 0)}
        </span>
      </StyledPriceInfo>
    </>
  );
};

export { PriceInfo };
