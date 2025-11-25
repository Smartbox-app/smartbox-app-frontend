import React from 'react';
import {
  AddonDynamicPricingType,
  AddonVariantPriceType,
  SingleAddonVariant,
} from 'smartbox-types';
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

const formatQuantity = (type: AddonDynamicPricingType, quantity: number) => {
  switch (type) {
    case AddonDynamicPricingType.Day: {
      if (quantity > 1) return 'dni';
      return 'dzień';
    }
    case AddonDynamicPricingType.Week: {
      if (quantity >= 5) return 'tygodni';
      if (quantity > 1) return 'tygodnie';
      return 'tydzień';
    }

    case AddonDynamicPricingType.Month: {
      if (quantity >= 5) return 'miesięcy';
      if (quantity > 1) return 'miesiące';
      return 'miesiąc';
    }

    case AddonDynamicPricingType.Quarter: {
      if (quantity >= 5) return 'kwartałów';
      if (quantity > 1) return 'kwartały';
      return 'kwartał';
    }

    case AddonDynamicPricingType.HalfYear: {
      return 'pół roku';
    }

    case AddonDynamicPricingType.Year: {
      if (quantity >= 5) return 'lat';
      if (quantity > 1) return 'lata';
      return 'rok';
    }
  }
};

const PriceInfo = ({ variant, isGross }: Props) => {
  const { priceType, price, pricing } = variant;

  if (priceType === AddonVariantPriceType.Fixed) {
    return (
      <StyledPriceInfo>
        <strong className="price-value">{formatPrice(price || 0)}</strong>
        <span className="price-type">
          {isGross ? __('application.gross') : __('application.net')}
        </span>
      </StyledPriceInfo>
    );
  }

  const firstPricing = pricing[0];

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
