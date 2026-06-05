import React, { useMemo } from 'react';
import {
  AddonDynamicPricingType,
  AddonVariantPriceType,
  SingleAddonVariant,
  PriceDisplayForClients,
  SingleAddonVariantForUser,
} from 'smartbox-types';
import styled from 'styled-components';
import { __ } from '../../../../../../../helpers/i18n';
import { formatPrice } from '../../../../../../../utils/format-price';
import { useI18n } from 'src/i18n';

interface Props {
  display: PriceDisplayForClients;
  variant: SingleAddonVariantForUser;
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

const PriceInfo = ({ variant, display }: Props) => {
  const { priceType, netPrice: fixedNetPrice, grossPrice: fixedGrossPrice, pricing } = variant;
  const { t } = useI18n();
  const priceInfo = useMemo(() => {
    const netPrice = priceType === AddonVariantPriceType.Fixed ? fixedNetPrice : pricing[0].netPrice;
    const grossPrice = priceType === AddonVariantPriceType.Fixed ? fixedGrossPrice : pricing[0].grossPrice;

    switch (display) {
      case PriceDisplayForClients.gross:
        return (
          <>
            <strong className="price-value">
              {formatPrice(grossPrice || 0)}
            </strong>
            <span className="price-type">{t('application.gross')}</span>
          </>
        );
      case PriceDisplayForClients.net:
        return (
          <>
            <strong className="price-value">
              {formatPrice(netPrice || 0)}
            </strong>
            <span className="price-type">{t('application.net')}</span>
          </>
        );
      case PriceDisplayForClients.both:
        return (
          <>
            <strong className="price-value">
              {formatPrice(grossPrice || 0)}
            </strong>
            <span className="price-type">{t('application.gross')}</span>/
            <span className="price-value">
              {formatPrice(netPrice || 0)}
            </span>
            <span className="price-type">{t('application.net')}</span>
          </>
        );
    }
  }, [variant, display]);

  if (priceType === AddonVariantPriceType.Fixed) {
    return <StyledPriceInfo>{priceInfo}</StyledPriceInfo>;
  }

  const firstPricing = pricing[0];

  if (!firstPricing.price || !firstPricing.quantity) return null;

  return (
    <StyledPriceInfo>
      {priceInfo}/
      <span>
        {firstPricing.quantity}{' '}
        {formatQuantity(firstPricing.type, firstPricing.quantity || 0)}
      </span>
    </StyledPriceInfo>
  );
};

export { PriceInfo };
