import React from 'react';
import { AddonPricingType, SingleAddonVariant } from 'smartbox-types';
import styled from 'styled-components';
import { __ } from '../../../../../../../helpers/i18n';
import { formatPrice } from '../../../../../../../utils/format-price';

interface Props {
  isGross: boolean;
  variant: SingleAddonVariant;
}

const StyledPriceInfo = styled('div')(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  backgroundColor: theme.colors.surface.success.secondary,
  borderRadius: theme.spacing * 2,
  padding: theme.spacing * 2,
  color: theme.colors.surface.success.primary,
  '.price-type': {
    marginLeft: 5,
  },
}));

const formatQuantity = (type: AddonPricingType, quantity: number) => {
  switch (type) {
    case AddonPricingType.Day: {
      if (quantity > 1) return 'dni';
      return 'dzień';
    }
    case AddonPricingType.Week: {
      if (quantity >= 5) return 'tygodni';
      if (quantity > 1) return 'tygodnie';
      return 'tydzień';
    }

    case AddonPricingType.Month: {
      if (quantity >= 5) return 'miesięcy';
      if (quantity > 1) return 'miesiące';
      return 'miesiąc';
    }

    case AddonPricingType.Quarter: {
      if (quantity >= 5) return 'kwartałów';
      if (quantity > 1) return 'kwartały';
      return 'kwartał';
    }

    case AddonPricingType.HalfYear: {
      return 'pół roku';
    }

    case AddonPricingType.Year: {
      if (quantity >= 5) return 'lat';
      if (quantity > 1) return 'lata';
      return 'rok';
    }
  }
};

const PriceInfo = ({ variant, isGross }: Props) => {
  const firstPricing = variant.pricing[0];

  if (!firstPricing.price || !firstPricing.quantity) return null;

  return (
    <StyledPriceInfo>
      <strong className="price-value">
        {formatPrice(firstPricing.price || 0)}
      </strong>
      <span className="price-type">
        {isGross ? __('application.gross') : __('application.net')}
      </span>
      /
      <span>
        {firstPricing.quantity}{' '}
        {formatQuantity(firstPricing.type, firstPricing.quantity || 0)}
      </span>
    </StyledPriceInfo>
  );
};

export { PriceInfo };
